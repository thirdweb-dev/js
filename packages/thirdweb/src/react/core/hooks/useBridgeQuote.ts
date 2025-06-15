"use client";
import { useQuery } from "@tanstack/react-query";
import * as Buy from "../../../bridge/Buy.js";
import * as Transfer from "../../../bridge/Transfer.js";
import type { Token } from "../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { checksumAddress } from "../../../utils/address.js";

interface UseBridgeQuoteParams {
  originToken: Token;
  destinationToken: Token;
  destinationAmount: bigint;
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
      destinationAmount.toString(),
    ],
    queryFn: async () => {
      // if ssame token and chain, use transfer
      if (
        checksumAddress(originToken.address) ===
          checksumAddress(destinationToken.address) &&
        originToken.chainId === destinationToken.chainId
      ) {
        const transfer = await Transfer.prepare({
          client,
          chainId: originToken.chainId,
          tokenAddress: originToken.address,
          sender: originToken.address,
          receiver: destinationToken.address,
          amount: destinationAmount,
        });
        return transfer;
      }
      const quote = await Buy.quote({
        originChainId: originToken.chainId,
        originTokenAddress: originToken.address,
        destinationChainId: destinationToken.chainId,
        destinationTokenAddress: destinationToken.address,
        amount: destinationAmount,
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
