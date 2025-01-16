import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { hasRole } from "thirdweb/extensions/permissions";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export function useIsAdmin(contract: ThirdwebContract, failOpen = true) {
  const address = useActiveAccount()?.address;
  const { data: userIsAdmin, isError } = useReadContract(hasRole, {
    contract,
    targetAccountAddress: address ?? "",
    role: "admin",
    queryOptions: { enabled: !!address },
  });

  // If the request results in an error, it's likely that the contract is a non-thirdweb contract
  // in that case we return `true` anyway
  return userIsAdmin || (failOpen && isError);
}

export function useIsAdminOrSelf(
  contract: ThirdwebContract,
  self: string | null | undefined,
) {
  const address = useActiveAccount()?.address;
  const isAdmin = useIsAdmin(contract);
  if (address === self) {
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
