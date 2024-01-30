"use-client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { isTxOpts } from "../../transaction/transaction.js";
import { isObjectWithKeys } from "../../utils/type-guards.js";
import { waitForReceipt } from "../../transaction/actions/wait-for-tx-receipt.js";
import type { WaitForReceiptOptions } from "../../transaction/actions/wait-for-tx-receipt.js";
import type { Abi } from "abitype";
import { useAutoConnect } from "../hooks/connection/useAutoConnect.js";
import { ThirdwebProviderContext } from "./thirdweb-provider-ctx.js";

import type { WalletConfig } from "../types/wallets.js";
import { defaultWallets } from "../wallets/defaultWallets.js";

export type ThirdwebProviderProps = {
  children?: React.ReactNode;
  wallets?: WalletConfig[];
  autoConnect?: boolean;
};

/**
 * The ThirdwebProvider is the root component for all Thirdweb React apps.
 * It sets up the React Query client and the WalletProvider.
 * @param props - The props for the ThirdwebProvider
 * @returns Your app wrapped in the ThirdwebProvider
 * @example
 * ```jsx
 * import { ThirdwebProvider } from "thirdweb/react";
 *
 * <ThirdwebProvider>
 *  <YourApp />
 * </ThirdwebProvider>
 * ```
 */
export function ThirdwebProvider(props: ThirdwebProviderProps) {
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
                  isObjectWithKeys(data, ["transactionHash", "contract"]) ||
                  isObjectWithKeys(data, ["userOpHash", "contract"])
                ) {
                  waitForReceipt(data as WaitForReceiptOptions<Abi>)
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
      <ThirdwebProviderContext.Provider
        value={{
          wallets: props.wallets || defaultWallets,
          autoConnect:
            props.autoConnect === undefined ? true : props.autoConnect,
        }}
      >
        <AutoConnect />
        {props.children}
      </ThirdwebProviderContext.Provider>
    </QueryClientProvider>
  );
}

/**
 * @internal
 */
function AutoConnect() {
  useAutoConnect();
  return <></>;
}
