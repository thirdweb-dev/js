"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { waitForReceipt } from "../../../transaction/actions/wait-for-tx-receipt.js";
import { isBaseTransactionOptions } from "../../../transaction/types.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { isObjectWithKeys } from "../../../utils/type-guards.js";
import type { ConnectionManager } from "../../../wallets/manager/index.js";
import { structuralSharing } from "../utils/structuralSharing.js";
import { ConnectionManagerCtx } from "./connection-manager.js";
import { invalidateWalletBalance } from "./invalidateWalletBalance.js";
import { SetRootElementContext } from "./RootElementContext.js";

/**
 * @internal
 */
export function ThirdwebProviderCore(props: {
  manager: ConnectionManager;
  children: React.ReactNode;
}) {
  const [el, setEl] = useState<React.ReactNode>(null);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onSettled: (data, _error, variables) => {
              if (isBaseTransactionOptions(variables)) {
                if (
                  isObjectWithKeys(data, ["transactionHash"]) &&
                  isObjectWithKeys(variables, ["client", "chain"])
                ) {
                  waitForReceipt({
                    chain: variables.chain, // We know it exists from the if
                    client: variables.client,
                    transactionHash: data.transactionHash as Hex,
                  })
                    .catch((e) => {
                      // swallow errors for receipts, but log
                      console.error("[Transaction Error]", e);
                    })
                    .then(() => {
                      return Promise.all([
                        queryClient.invalidateQueries({
                          queryKey:
                            // invalidate any readContract queries for this chainId:contractAddress
                            [
                              "readContract",
                              variables.__contract?.chain.id ||
                                variables.chain.id,
                              variables.__contract?.address || variables.to,
                            ] as const,
                        }),
                        invalidateWalletBalance(
                          queryClient,
                          variables.__contract?.chain.id || variables.chain.id,
                        ),
                      ]);
                    });
                }
              }
            },
          },
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            structuralSharing,
          },
        },
      }),
  );

  return (
    <ConnectionManagerCtx.Provider value={props.manager}>
      <QueryClientProvider client={queryClient}>
        <SetRootElementContext.Provider value={setEl}>
          {props.children}
        </SetRootElementContext.Provider>
        {el}
      </QueryClientProvider>
    </ConnectionManagerCtx.Provider>
  );
}
