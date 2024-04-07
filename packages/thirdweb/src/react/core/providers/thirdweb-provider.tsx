import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import {
  type WaitForReceiptOptions,
  waitForReceipt,
} from "../../../transaction/actions/wait-for-tx-receipt.js";
import { isBaseTransactionOptions } from "../../../transaction/types.js";
import { isObjectWithKeys } from "../../../utils/type-guards.js";

/**
 * The ThirdwebProvider is component is a provider component that sets up the React Query client.
 * @param props - The props for the ThirdwebProvider
 * @example
 * ```jsx
 * import { ThirdwebProvider } from "thirdweb/react";
 *
 * function Example() {
 *  return (
 *    <ThirdwebProvider>
 *      <App />
 *    </ThirdwebProvider>
 *   )
 * }
 * ```
 * @component
 */
export function ThirdwebProvider(props: React.PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onSettled: (data, error, variables) => {
              console.log("Mutation settled", data, error, variables);
              if (error) {
                // TODO: remove - but useful for debug now
                console.error("[Mutation Error]", error);
              }
              if (isBaseTransactionOptions(variables)) {
                if (
                  isObjectWithKeys(data, ["transactionHash", "client", "chain"])
                ) {
                  waitForReceipt(data as WaitForReceiptOptions)
                    .catch((e) => {
                      // swallow errors for receipts, but log
                      console.error("[Transaction Error]", e);
                    })
                    .then(() => {
                      return queryClient.invalidateQueries({
                        queryKey: [
                          // invalidate any readContract queries for this chainId:contractAddress
                          [
                            "readContract",
                            variables.__contract?.chain.id,
                            variables.__contract?.address,
                          ] as const,
                          // invalidate any walletBalance queries for this chainId
                          // TODO: add wallet address in here if we can get it somehow
                          [
                            "walletBalance",
                            variables.__contract?.chain.id,
                          ] as const,
                        ],
                      });
                    });
                }
              }
            },
          },
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
