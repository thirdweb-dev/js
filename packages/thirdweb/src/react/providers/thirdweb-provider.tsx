"use-client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WallerProvider } from "./wallet-provider.js";
import { isTxOpts } from "../../transaction/transaction.js";
import { isObjectWithKeys } from "../../utils/type-guards.js";
import { waitForReceipt } from "../../transaction/index.js";

export const ThirdwebProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onSettled: (data, error, variables) => {
              if (error) {
                // TODO: remove - but useful for debug now
                console.error("[Mutation Error]", error);
              }
              if (isTxOpts(variables)) {
                if (
                  isObjectWithKeys(data, ["transactionHash"]) &&
                  typeof data.transactionHash === "string"
                ) {
                  waitForReceipt({
                    transactionHash: data.transactionHash,
                    contract: variables.contract,
                  })
                    .catch((e) => {
                      // swallow errors for receipts, but log
                      console.error("[Transaction Error]", e);
                    })
                    .then(() => {
                      return queryClient.invalidateQueries({
                        queryKey: [
                          variables.contract.chainId,
                          variables.contract.address,
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
      <WallerProvider>{children}</WallerProvider>
    </QueryClientProvider>
  );
};
