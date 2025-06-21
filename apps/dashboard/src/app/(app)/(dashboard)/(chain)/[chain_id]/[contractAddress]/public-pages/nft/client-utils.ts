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
    enabled: params.enabled,
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
        client: params.contract.client,
        currencyAddress: activeClaimCondition.currency,
      });

      if (!currencyMeta) {
        return null;
      }

      return {
        ...activeClaimCondition,
        decimals: currencyMeta.decimals,
        symbol: currencyMeta.symbol,
      };
    },
    queryKey: [
      ASSET_PAGE_ERC1155_QUERIES_ROOT_KEY,
      "ERC1155_getActiveClaimCondition",
      {
        contract: params.contract,
        tokenId: params.tokenId.toString(),
      },
    ],
  });

  const publicPrice = claimConditionQuery.data
    ? {
        currencyAddress: claimConditionQuery.data.currency,
        decimals: claimConditionQuery.data.decimals,
        pricePerTokenWei: claimConditionQuery.data.pricePerToken,
        symbol: claimConditionQuery.data.symbol,
      }
    : null;

  const claimParamsQuery = useQuery({
    enabled: params.enabled,
    queryFn: async () => {
      if (!account) {
        return null;
      }

      const claimParams = await getClaimParams({
        contract: params.contract,
        from: account?.address,
        quantity: BigInt(1),
        to: account?.address,
        tokenId: params.tokenId,
        type: "erc1155",
      });

      const meta = await getCurrencyMeta({
        chain: params.contract.chain,
        chainMetadata: params.chainMetadata,
        client: params.contract.client,
        currencyAddress: claimParams.currency,
      });

      return {
        currencyAddress: claimParams.currency,
        decimals: meta.decimals,
        pricePerTokenWei: claimParams.pricePerToken,
        symbol: meta.symbol,
      };
    },
    queryKey: [
      ASSET_PAGE_ERC1155_QUERIES_ROOT_KEY,
      "ERC1155_getClaimParams",
      {
        accountAddress: account?.address,
        contract: params.contract,
        tokenId: params.tokenId.toString(),
      },
    ],
  });

  const publicPriceData = claimConditionQuery.data
    ? {
        currencyAddress: claimConditionQuery.data.currency,
        decimals: claimConditionQuery.data.decimals,
        pricePerTokenWei: claimConditionQuery.data.pricePerToken,
        symbol: claimConditionQuery.data.symbol,
      }
    : undefined;

  const userSpecificPriceData = claimParamsQuery.data
    ? {
        currencyAddress: claimParamsQuery.data.currencyAddress,
        decimals: claimParamsQuery.data.decimals,
        pricePerTokenWei: claimParamsQuery.data.pricePerTokenWei,
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
            maxClaimableSupply: claimConditionQuery.data?.maxClaimableSupply,
            quantityLimitPerWallet:
              claimConditionQuery.data?.quantityLimitPerWallet,
            supplyClaimed: claimConditionQuery.data?.supplyClaimed,
          }
        : undefined,
      isPending: claimConditionQuery.isPending,
    },
    claimParamsQuery: {
      data: claimParamsQuery.data || publicPrice,
      isPending: claimParamsQuery.isPending,
    },
    isUserPriceDifferent,
    publicPriceQuery: {
      data: publicPriceData,
      isPending: claimConditionQuery.isPending,
    },
    userPriceQuery: {
      data: userSpecificPriceData || publicPriceData,
      isPending: claimParamsQuery.isPending || claimConditionQuery.isPending,
    },
  };
}
