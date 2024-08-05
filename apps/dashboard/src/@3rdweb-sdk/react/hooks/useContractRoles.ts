import {
  type ContractWithRoles,
  type RolesForContract,
  useContractType,
  useRoleMembers,
} from "@thirdweb-dev/react";
import type { ValidContractInstance } from "@thirdweb-dev/sdk";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { hasRole } from "thirdweb/extensions/permissions";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import type { RequiredParam } from "utils/types";

function isContractWithRoles(
  contract: RequiredParam<ValidContractInstance>,
): contract is ContractWithRoles {
  if (contract && "roles" in contract) {
    return true;
  }
  return false;
}

function useIsAccountRole<TContract extends ContractWithRoles>(
  role: RolesForContract<TContract>[number],
  contract: RequiredParam<TContract>,
  account: RequiredParam<string>,
): boolean {
  const contractHasRoles = isContractWithRoles(contract);
  const { data } = useRoleMembers(contract, role);

  if (contractHasRoles === false) {
    return false;
  }

  if (data?.includes(ZERO_ADDRESS)) {
    return true;
  }

  return !!(account && data?.includes(account));
}

export function useIsAdmin<TContract extends ValidContractInstance>(
  contract: RequiredParam<TContract>,
) {
  const address = useActiveAccount()?.address;
  const { data: contractType } = useContractType(contract?.getAddress());

  const contractHasRoles = isContractWithRoles(contract);
  const isAccountRole = useIsAccountRole(
    "admin",
    contractHasRoles ? contract : undefined,
    address,
  );

  if (contractType === "custom") {
    return true;
  }
  return isAccountRole;
}

export function useIsAdminOrSelf<TContract extends ValidContractInstance>(
  contract: RequiredParam<TContract>,
  self: RequiredParam<string>,
) {
  const address = useActiveAccount()?.address;
  const { data: contractType } = useContractType(contract?.getAddress());
  const isAdmin = useIsAdmin(contract);

  if (address === self) {
    return true;
  }
  if (contractType === "custom") {
    return true;
  }
  return isAdmin;
}

export function useIsMinter(contract: ThirdwebContract) {
  const address = useActiveAccount()?.address;
  const userCanMintQuery = useReadContract(hasRole, {
    contract,
    targetAccountAddress: address ?? "",
    role: "minter",
    queryOptions: { enabled: !!address },
  });

  const anyoneCanMintQuery = useReadContract(hasRole, {
    contract,
    targetAccountAddress: ZERO_ADDRESS,
    role: "minter",
  });

  // If both requests "error out", we can safely assume that
  // this is a custom (aka. non-thirdweb) contract
  // so we just return `true` in that case
  const isCustomContract =
    userCanMintQuery.isError && anyoneCanMintQuery.isError;

  return anyoneCanMintQuery.data || userCanMintQuery.data || isCustomContract;
}

// Applicable to Marketplace v3 only
export function useIsLister(contract: ThirdwebContract) {
  const address = useActiveAccount()?.address;
  const { data: userCanList } = useReadContract(hasRole, {
    contract,
    targetAccountAddress: address ?? "",
    role: "lister",
    queryOptions: { enabled: !!address },
  });

  const { data: anyoneCanList } = useReadContract(hasRole, {
    contract,
    targetAccountAddress: ZERO_ADDRESS,
    role: "lister",
  });

  return anyoneCanList || userCanList;
}
