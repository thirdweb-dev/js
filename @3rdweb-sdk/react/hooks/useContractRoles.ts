import { contractRoleKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useWeb3 } from "@3rdweb-sdk/react";
import { AddressZero } from "@ethersproject/constants";
import {
  Split,
  ValidContractClass,
  ValidContractInstance,
  Vote,
} from "@thirdweb-dev/sdk";
import invariant from "tiny-invariant";
import { C, U } from "ts-toolbelt";

export type ContractWithRoles = U.Exclude<
  ValidContractClass,
  typeof Vote | typeof Split
>;

export type ContractWithRolesInstance = C.Instance<ContractWithRoles>;

export function isContractWithRoles(
  contract?: ValidContractInstance,
): contract is C.Instance<ContractWithRoles> {
  if (contract && "roles" in contract) {
    return true;
  }
  return false;
}

export function useContractRoleMembersList<TContract extends ContractWithRoles>(
  contract?: C.Instance<TContract>,
) {
  return useQueryWithNetwork(
    contractRoleKeys.list(contract?.getAddress()),
    async () => {
      invariant(
        contract?.roles.getAll,
        "[Contract:useContractRoleMembersList] - contract has no roles",
      );
      return await contract.roles.getAll();
    },
    {
      enabled: !!contract && !!contract.getAddress(),
    },
  );
}

export function useContractRoleMembers<TContract extends ContractWithRoles>(
  role: TContract["contractRoles"][number],
  contract?: C.Instance<TContract>,
) {
  return useQueryWithNetwork(
    contractRoleKeys.detail(contract?.getAddress(), role),
    async () => await contract?.roles.get(role as any),
    {
      enabled: !!contract && !!contract.getAddress() && !!role,
    },
  );
}

export function useSetAllRoleMembersMutation<
  TContract extends ContractWithRoles,
>(contract?: C.Instance<TContract>) {
  return useMutationWithInvalidate(
    async (rolesWithAddresses: {
      [role in TContract["contractRoles"][number]]: string[];
    }) => {
      invariant(contract, "contract is required");
      await contract.roles.setAll(rolesWithAddresses);
    },
    {
      onSuccess: (_data, variables, _options, invalidate) => {
        return invalidate([contractRoleKeys.list(contract?.getAddress())]);
      },
    },
  );
}

export function useAddRoleMemberMutation<TContract extends ContractWithRoles>(
  contract?: C.Instance<TContract>,
) {
  return useMutationWithInvalidate(
    async (variables: {
      role: TContract["contractRoles"][number];
      address: string;
    }) => {
      invariant(contract, "contract is required");
      await contract.roles.grant(variables.role as any, variables.address);
    },
    {
      onSuccess: (_data, variables, _options, invalidate) => {
        return invalidate([
          contractRoleKeys.list(contract?.getAddress()),
          contractRoleKeys.detail(contract?.getAddress(), variables.role),
        ]);
      },
    },
  );
}
export function useIsAccountRole<TContract extends ContractWithRoles>(
  role: TContract["contractRoles"][number],
  contract?: C.Instance<TContract>,
  account?: string,
): boolean {
  const contractHasRoles = isContractWithRoles(contract);
  const { data } = useContractRoleMembers(
    role,
    contractHasRoles ? contract : undefined,
  );

  if (contractHasRoles === false) {
    return false;
  }

  if (data?.includes(AddressZero)) {
    return true;
  }

  return !!(account && data?.includes(account));
}

export function useIsAdmin<TContract extends ValidContractClass>(
  contract?: C.Instance<TContract>,
) {
  const { address } = useWeb3();
  const contractHasRoles = isContractWithRoles(contract);
  return useIsAccountRole(
    "admin",
    contractHasRoles ? contract : undefined,
    address,
  );
}
