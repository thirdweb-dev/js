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
  feePayer?: "sender" | "receiver";
}

export function useBridgeQuote({
  originToken,
  destinationToken,
  destinationAmount,
  feePayer,
  client,
  enabled = true,
}: UseBridgeQuoteParams) {
  return useQuery({
    enabled:
      enabled && !!originToken && !!destinationToken && !!destinationAmount,
    queryFn: async () => {
      // if ssame token and chain, use transfer
      if (
        checksumAddress(originToken.address) ===
          checksumAddress(destinationToken.address) &&
        originToken.chainId === destinationToken.chainId
      ) {
        const transfer = await Transfer.prepare({
          amount: destinationAmount,
          chainId: originToken.chainId,
          client,
          feePayer,
          receiver: destinationToken.address,
          sender: originToken.address,
          tokenAddress: originToken.address,
        });
        return transfer;
      }
      const quote = await Buy.quote({
        amount: destinationAmount,
        client,
        destinationChainId: destinationToken.chainId,
        destinationTokenAddress: destinationToken.address,
        originChainId: originToken.chainId,
        originTokenAddress: originToken.address,
      });

      return quote;
    },
    queryKey: [
      "bridge-quote",
      originToken.chainId,
      originToken.address,
      destinationToken.chainId,
      destinationToken.address,
      destinationAmount.toString(),
      feePayer,
    ],
    refetchInterval: 60000, // 30 seconds
    retry: 3, // 1 minute
    staleTime: 30000,
  });
}
