import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { Value } from "ox";
import { Buy } from "../../../../bridge/index.js";
import { getCachedChain } from "../../../../chains/utils.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { getContract } from "../../../../contract/contract.js";
import { decimals } from "../../../../extensions/erc20/read/decimals.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getAddress } from "../../../../utils/address.js";

export type UseBuyPrepareParams = {
  client: ThirdwebClient;
  fromAddress: string;
  toAddress: string;
  fromChainId: number;
  fromTokenAddress: string;
  toChainId: number;
  toTokenAddress: string;
  toAmount: string;
  purchaseData?: object;
  paymentLinkId?: string;
};

/**
 * Hook to prepare a **finalized** Universal Bridge quote for buying a specific amount of tokens with transaction data.
 * This hook supports multi-step routes and returns everything needed to execute the bridge transaction(s).
 *
 * @example
 * ```tsx
 * import { useBuyPrepare } from "thirdweb/react";
 * import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
 *
 * function BuyButton() {
 *   const { data: quote, isLoading } = useBuyPrepare({
 *     client,
 *     fromAddress: "0x...", // sender address
 *     toAddress: "0x...", // receiver address
 *     fromChainId: 1,
 *     fromTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     toChainId: 10,
 *     toTokenAddress: NATIVE_TOKEN_ADDRESS,
 *     toAmount: "0.01", // amount of destination token to receive
 *   });
 *
 *   if (isLoading) return <div>Getting quote...</div>;
 *   if (!quote) return null;
 *
 *   // The quote includes:
 *   // - originAmount: amount of source token needed
 *   // - steps: array of route steps (can be multiple for complex routes)
 *   // - each step has transactions array with approval and swap transactions
 *
 *   return (
 *     <button onClick={() => executeQuote(quote)}>
 *       Buy {quote.toAmount} tokens for {quote.originAmount} tokens
 *     </button>
 *   );
 * }
 * ```
 *
 * ## Multi-step Routes
 *
 * The returned quote may contain multiple steps for complex routes (e.g., Token A → Token B → Token C).
 * Each step contains its own set of transactions that must be executed in order.
 *
 * ```tsx
 * // Example of executing a multi-step quote
 * async function executeQuote(quote) {
 *   for (const step of quote.steps) {
 *     for (const tx of step.transactions) {
 *       if (tx.action === "approval") {
 *         // Execute approval transaction
 *         await sendAndConfirmTransaction({ transaction: tx, account });
 *       } else {
 *         // Execute bridge transaction
 *         const result = await sendTransaction({ transaction: tx, account });
 *         // For non-approval transactions, use Bridge.status to track completion
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param params - The parameters for the bridge buy quote
 * @param params.client - Your thirdweb client
 * @param params.fromAddress - The address of the sender
 * @param params.toAddress - The address of the receiver
 * @param params.fromChainId - The chain ID of the origin token
 * @param params.fromTokenAddress - The address of the origin token
 * @param params.toChainId - The chain ID of the destination token
 * @param params.toTokenAddress - The address of the destination token
 * @param params.toAmount - The amount of destination token to receive (as a string)
 * @param params.purchaseData - Optional arbitrary data to include with the purchase
 * @param params.paymentLinkId - Optional payment link ID for tracking
 * @param queryOptions - React Query options for customizing the query behavior
 *
 * @returns A React Query result containing the prepared bridge quote with transaction data
 *
 * @bridge
 * @beta
 */
export function useBuyPrepare(
  params?: UseBuyPrepareParams,
  queryOptions?: Omit<
    UseQueryOptions<Buy.prepare.Result>,
    "queryFn" | "queryKey" | "enabled"
  >,
): UseQueryResult<Buy.prepare.Result> {
  return useQuery({
    ...queryOptions,
    queryKey: ["bridge-buy-prepare", params],
    queryFn: async () => {
      if (!params) {
        throw new Error("Bridge parameters are required");
      }

      const destinationTokenContract = getContract({
        address: params.toTokenAddress,
        chain: getCachedChain(params.toChainId),
        client: params.client,
      });

      const tokenDecimals =
        getAddress(destinationTokenContract.address) ===
          getAddress(NATIVE_TOKEN_ADDRESS)
          ? 18
          : await decimals({ contract: destinationTokenContract });

      const amount = Value.from(params.toAmount, tokenDecimals);

      return Buy.prepare({
        sender: params.fromAddress,
        receiver: params.toAddress,
        originChainId: params.fromChainId,
        originTokenAddress: params.fromTokenAddress,
        destinationChainId: params.toChainId,
        destinationTokenAddress: params.toTokenAddress,
        amount: amount,
        purchaseData: params.purchaseData,
        client: params.client,
        paymentLinkId: params.paymentLinkId,
      });
    },
    enabled: !!params,
    retry: false,
  });
}
