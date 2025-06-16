import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { getActiveClaimCondition as ERC1155_getActiveClaimCondition } from "thirdweb/extensions/erc1155";
import { useActiveAccount } from "thirdweb/react";
import { getClaimParams } from "thirdweb/utils";
import { getCurrencyMeta } from "../erc20/_utils/getCurrencyMeta";

export const ASSET_PAGE_ERC1155_QUERIES_ROOT_KEY = "erc1155-asset-page-queries";

export function useERC1155ClaimCondition(params: {
  chainMetadata: ChainMetadata;
  tokenId: bigint;
  contract: ThirdwebContract;
  enabled: boolean;
}) {
  const account = useActiveAccount();
  const claimConditionQuery = useQuery({
    queryKey: [
      ASSET_PAGE_ERC1155_QUERIES_ROOT_KEY,
      "ERC1155_getActiveClaimCondition",
      {
        contract: params.contract,
        tokenId: params.tokenId.toString(),
      },
    ],
    queryFn: async () => {
      const activeClaimCondition = await ERC1155_getActiveClaimCondition({
        contract: params.contract,
        tokenId: params.tokenId,
      });

      if (!activeClaimCondition) {
        return null;
      }

      const currencyMeta = await getCurrencyMeta({
        chain: params.contract.chain,
        chainMetadata: params.chainMetadata,
        currencyAddress: activeClaimCondition.currency,
        client: params.contract.client,
      });

      if (!currencyMeta) {
        return null;
      }

      return {
        ...activeClaimCondition,
        symbol: currencyMeta.symbol,
        decimals: currencyMeta.decimals,
      };
    },
    enabled: params.enabled,
  });

  const publicPrice = claimConditionQuery.data
    ? {
        pricePerTokenWei: claimConditionQuery.data.pricePerToken,
        currencyAddress: claimConditionQuery.data.currency,
        decimals: claimConditionQuery.data.decimals,
        symbol: claimConditionQuery.data.symbol,
      }
    : null;

  const claimParamsQuery = useQuery({
    queryKey: [
      ASSET_PAGE_ERC1155_QUERIES_ROOT_KEY,
      "ERC1155_getClaimParams",
      {
        contract: params.contract,
        accountAddress: account?.address,
        tokenId: params.tokenId.toString(),
      },
    ],
    queryFn: async () => {
      if (!account) {
        return null;
      }

      const claimParams = await getClaimParams({
        type: "erc1155",
        tokenId: params.tokenId,
        contract: params.contract,
        quantity: BigInt(1),
        to: account?.address,
        from: account?.address,
      });

      const meta = await getCurrencyMeta({
        currencyAddress: claimParams.currency,
        chainMetadata: params.chainMetadata,
        chain: params.contract.chain,
        client: params.contract.client,
      });

      return {
        pricePerTokenWei: claimParams.pricePerToken,
        currencyAddress: claimParams.currency,
        decimals: meta.decimals,
        symbol: meta.symbol,
      };
    },
    enabled: params.enabled,
  });

  const publicPriceData = claimConditionQuery.data
    ? {
        pricePerTokenWei: claimConditionQuery.data.pricePerToken,
        currencyAddress: claimConditionQuery.data.currency,
        decimals: claimConditionQuery.data.decimals,
        symbol: claimConditionQuery.data.symbol,
      }
    : undefined;

  const userSpecificPriceData = claimParamsQuery.data
    ? {
        pricePerTokenWei: claimParamsQuery.data.pricePerTokenWei,
        currencyAddress: claimParamsQuery.data.currencyAddress,
        decimals: claimParamsQuery.data.decimals,
        symbol: claimParamsQuery.data.symbol,
      }
    : undefined;

  const isUserPriceDifferent =
    userSpecificPriceData &&
    publicPrice &&
    (publicPrice.pricePerTokenWei !== userSpecificPriceData.pricePerTokenWei ||
      publicPrice.currencyAddress !== userSpecificPriceData.currencyAddress);

  return {
    claimCondition: {
      data: claimConditionQuery.data
        ? {
            quantityLimitPerWallet:
              claimConditionQuery.data?.quantityLimitPerWallet,
            maxClaimableSupply: claimConditionQuery.data?.maxClaimableSupply,
            supplyClaimed: claimConditionQuery.data?.supplyClaimed,
          }
        : undefined,
      isPending: claimConditionQuery.isPending,
    },
    claimParamsQuery: {
      data: claimParamsQuery.data || publicPrice,
      isPending: claimParamsQuery.isPending,
    },
    publicPriceQuery: {
      data: publicPriceData,
      isPending: claimConditionQuery.isPending,
    },
    userPriceQuery: {
      data: userSpecificPriceData || publicPriceData,
      isPending: claimParamsQuery.isPending || claimConditionQuery.isPending,
    },
    isUserPriceDifferent,
  };
}
