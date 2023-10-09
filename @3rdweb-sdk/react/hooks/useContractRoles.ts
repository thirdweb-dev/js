import {
  ContractWithRoles,
  RequiredParam,
  RolesForContract,
  useAddress,
  useContractType,
  useRoleMembers,
} from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { constants } from "ethers";

export function isContractWithRoles(
  contract: RequiredParam<ValidContractInstance>,
): contract is ContractWithRoles {
  if (contract && "roles" in contract) {
    return true;
  }
  return false;
}

export function useIsAccountRole<TContract extends ContractWithRoles>(
  role: RolesForContract<TContract>[number],
  contract: RequiredParam<TContract>,
  account: RequiredParam<string>,
): boolean {
  const contractHasRoles = isContractWithRoles(contract);
  const { data } = useRoleMembers(contract, role);

  if (contractHasRoles === false) {
    return false;
  }

  if (data?.includes(constants.AddressZero)) {
    return true;
  }

  return !!(account && data?.includes(account));
}

export function useIsAdmin<TContract extends ValidContractInstance>(
  contract: RequiredParam<TContract>,
) {
  const address = useAddress();
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
  const address = useAddress();
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

export function useIsMinter<TContract extends ValidContractInstance>(
  contract: RequiredParam<TContract>,
) {
  const address = useAddress();
  const { data: contractType } = useContractType(contract?.getAddress());
  const contractHasRoles = isContractWithRoles(contract);
  const isAccountRole = useIsAccountRole(
    "minter",
    contractHasRoles ? contract : undefined,
    address,
  );

  if (contractType === "custom") {
    return true;
  }
  return isAccountRole;
}

export function useIsLister<TContract extends ValidContractInstance>(
  contract: RequiredParam<TContract>,
) {
  const address = useAddress();
  const { data: contractType } = useContractType(contract?.getAddress());
  const contractHasRoles = isContractWithRoles(contract);
  const isAccountRole = useIsAccountRole(
    "lister",
    contractHasRoles ? contract : undefined,
    address,
  );

  if (contractType === "custom") {
    return true;
  }
  return isAccountRole;
}
