"use client";
import { useQuery } from "@tanstack/react-query";
import * as Buy from "../../../bridge/Buy.js";
import * as Transfer from "../../../bridge/Transfer.js";
import type { Token } from "../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { toUnits } from "../../../utils/units.js";

export interface UseBridgeQuoteParams {
  originToken: Token;
  destinationToken: Token;
  destinationAmount: string;
  client: ThirdwebClient;
  enabled?: boolean;
}

export function useBridgeQuote({
  originToken,
  destinationToken,
  destinationAmount,
  client,
  enabled = true,
}: UseBridgeQuoteParams) {
  return useQuery({
    queryKey: [
      "bridge-quote",
      originToken.chainId,
      originToken.address,
      destinationToken.chainId,
      destinationToken.address,
      destinationAmount,
    ],
    queryFn: async () => {
      const destinationAmountWei = toUnits(
        destinationAmount,
        destinationToken.decimals,
      );

      // if ssame token and chain, use transfer
      if (
        originToken.address.toLowerCase() ===
          destinationToken.address.toLowerCase() &&
        originToken.chainId === destinationToken.chainId
      ) {
        const transfer = await Transfer.prepare({
          client,
          chainId: originToken.chainId,
          tokenAddress: originToken.address,
          sender: originToken.address,
          receiver: destinationToken.address,
          amount: destinationAmountWei,
        });
        return transfer;
      }

      const quote = await Buy.quote({
        originChainId: originToken.chainId,
        originTokenAddress: originToken.address,
        destinationChainId: destinationToken.chainId,
        destinationTokenAddress: destinationToken.address,
        amount: destinationAmountWei,
        client,
      });

      return quote;
    },
    enabled:
      enabled && !!originToken && !!destinationToken && !!destinationAmount,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    retry: 3,
  });
}
