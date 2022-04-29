import { tokenDropKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";
import { useContractMetadata } from "./useContract";
import { useWeb3 } from "@3rdweb-sdk/react";
import { useTokenDrop } from "@thirdweb-dev/react";
import { ClaimConditionInput, TokenDrop } from "@thirdweb-dev/sdk";
import { isAddress } from "ethers/lib/utils";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";
import { isAddressZero } from "utils/zeroAddress";

export function useTokenDropContractMetadata(contractAddress?: string) {
  return useContractMetadata(useTokenDrop(contractAddress));
}

export function useTokenDropData(contractAddress?: string) {
  const { address } = useWeb3();
  const tokenDropContract = useTokenDrop(contractAddress);
  return useQuery(
    tokenDropKeys.detail(contractAddress, address),
    async () => {
      const [currency, totalSupply, ownedBalance] = await Promise.all([
        tokenDropContract?.get(),
        tokenDropContract?.totalSupply(),
        address ? tokenDropContract?.balance() : Promise.resolve(false),
      ]);
      return {
        ...currency,
        totalSupply,
        ownedBalance,
      };
    },
    {
      enabled:
        !!tokenDropContract &&
        !!contractAddress &&
        !isAddressZero(contractAddress) &&
        isAddress(contractAddress),
    },
  );
}

export function useTokenDropBalance(
  contractAddress?: string,
  walletAddress?: string,
) {
  const { address } = useWeb3();
  const tokenDropContract = useTokenDrop(contractAddress);
  const addressToCheck = walletAddress || address;
  return useQuery(
    tokenDropKeys.balanceOf(contractAddress, addressToCheck),
    async () => await tokenDropContract?.balanceOf(addressToCheck || ""),
    {
      enabled:
        !!contractAddress &&
        !!addressToCheck &&
        !isAddressZero(contractAddress) &&
        isAddress(contractAddress),
    },
  );
}

export function useTokenDropActiveClaimCondition(contractAddress?: string) {
  const tokenDropContract = useTokenDrop(contractAddress);
  return useQueryWithNetwork(
    tokenDropKeys.activeClaimCondition(contractAddress),
    async () => {
      return await tokenDropContract?.claimConditions.getActive();
    },
    {
      enabled: !!tokenDropContract && !!contractAddress,
    },
  );
}

export function useTokenDropResetClaimEligibilityMutation(
  contract?: TokenDrop,
) {
  return useMutationWithInvalidate(async () => {
    invariant(contract, "contract is required");
    const claimConditions = await contract.claimConditions.getAll();

    const cleaned = claimConditions.map((c) => ({
      ...c,
      price: c.currencyMetadata.displayValue,
      maxQuantity: c.maxQuantity.toString(),
      quantityLimitPerTransaction: c.quantityLimitPerTransaction.toString(),
    }));

    return await contract.claimConditions.set(cleaned, true);
  });
}

// ----------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------

export function useTokenDropClaimConditionMutation(contract?: TokenDrop) {
  return useMutationWithInvalidate(
    async (data: ClaimConditionInput[]) => {
      invariant(contract, "contract is required");
      return await contract.claimConditions.set(data);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([
          tokenDropKeys.activeClaimCondition(contract?.getAddress()),
        ]);
      },
    },
  );
}
