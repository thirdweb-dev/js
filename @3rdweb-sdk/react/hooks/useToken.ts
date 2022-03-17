import { tokenKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useContractMetadata } from "./useContract";
import { useWeb3 } from "@3rdweb-sdk/react";
import { useToken } from "@thirdweb-dev/react";
import { Token } from "@thirdweb-dev/sdk";
import { isAddress } from "ethers/lib/utils";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";
import { isAddressZero } from "utils/zeroAddress";

export function useTokenContractMetadata(contractAddress?: string) {
  return useContractMetadata(useToken(contractAddress));
}

export function useTokenData(contractAddress?: string) {
  const { address } = useWeb3();
  const tokenContract = useToken(contractAddress);
  return useQuery(
    tokenKeys.detail(contractAddress, address),
    async () => {
      const [currency, totalSupply, ownedBalance] = await Promise.all([
        tokenContract?.get(),
        tokenContract?.totalSupply(),
        address ? tokenContract?.balance() : Promise.resolve(false),
      ]);
      return {
        ...currency,
        totalSupply,
        ownedBalance,
      };
    },
    {
      enabled:
        !!tokenContract &&
        !!contractAddress &&
        !isAddressZero(contractAddress) &&
        isAddress(contractAddress),
    },
  );
}

export function useTokenBalance(
  contractAddress?: string,
  walletAddress?: string,
) {
  const { address } = useWeb3();
  const tokenContract = useToken(contractAddress);
  const addressToCheck = walletAddress || address;
  return useQuery(
    tokenKeys.balanceOf(contractAddress, addressToCheck),
    () => tokenContract?.balanceOf(addressToCheck || ""),
    {
      enabled:
        !!contractAddress &&
        !!addressToCheck &&
        !isAddressZero(contractAddress) &&
        isAddress(contractAddress),
    },
  );
}

// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

export function useTokenMintMutation(contract?: Token) {
  return useMutationWithInvalidate(
    async (amount: string) => {
      invariant(contract, "contract is required");
      return await contract.mint(amount);
    },
    {
      onSuccess: (_data, _options, _variables, invalidate) => {
        return invalidate([tokenKeys.detail(contract?.getAddress())]);
      },
    },
  );
}
