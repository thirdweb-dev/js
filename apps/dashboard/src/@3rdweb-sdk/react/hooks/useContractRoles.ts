import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { hasRole } from "thirdweb/extensions/permissions";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export function useIsAdmin(contract: ThirdwebContract, failOpen = true) {
  const address = useActiveAccount()?.address;
  const { data: userIsAdmin, isError } = useReadContract(hasRole, {
    contract,
    queryOptions: { enabled: !!address },
    role: "admin",
    targetAccountAddress: address ?? "",
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
    queryOptions: { enabled: !!address },
    role: "minter",
    targetAccountAddress: address ?? "",
  });

  const anyoneCanMintQuery = useReadContract(hasRole, {
    contract,
    role: "minter",
    targetAccountAddress: ZERO_ADDRESS,
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
    queryOptions: { enabled: !!address },
    role: "lister",
    targetAccountAddress: address ?? "",
  });

  const { data: anyoneCanList } = useReadContract(hasRole, {
    contract,
    role: "lister",
    targetAccountAddress: ZERO_ADDRESS,
  });

  return anyoneCanList || userCanList;
}
