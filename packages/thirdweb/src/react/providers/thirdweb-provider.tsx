"use-client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WallerProvider } from "./wallet-provider.js";
import type { ThirdwebContract } from "../../contract/index.js";
import type { Abi } from "abitype";

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
              if (
                typeof variables === "object" &&
                !!variables &&
                "contract" in variables
              ) {
                let prom = Promise.resolve();
                if (typeof data === "object" && !!data && "wait" in data) {
                  prom = (data as any).wait();
                }
                const contract = variables.contract as ThirdwebContract<Abi>;
                // refetch after the tx is mined...
                prom.then(() => {
                  queryClient.invalidateQueries({
                    queryKey: [contract.chainId, contract.address],
                  });
                });
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
