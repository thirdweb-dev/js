/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isTxOpts } from "~thirdweb/transaction/transaction.js";
import { isObjectWithKeys } from "~thirdweb/utils/type-guards.js";
import { waitForReceipt } from "~thirdweb/transaction/actions/wait-for-tx-receipt.js";
import type { WaitForReceiptOptions } from "~thirdweb/transaction/actions/wait-for-tx-receipt.js";
import type { Abi } from "abitype";
import {
  AutoConnect,
  NoAutoConnect,
} from "../hooks/connection/useAutoConnect.js";
import { ThirdwebProviderContext } from "./thirdweb-provider-ctx.js";
import type { WalletConfig } from "../types/wallets.js";
import { defaultWallets } from "../wallets/defaultWallets.js";
import { getChainIdFromChain } from "~thirdweb/chain/index.js";
import { useState } from "react";
import type { ThirdwebClient } from "~thirdweb/client/client.js";
import { ThirdwebLocaleContext } from "./locale-provider.js";
import { WalletUIStatesProvider } from "./wallet-ui-states-provider.js";
import type { ThirdwebLocale } from "../ui/locales/types.js";
import { en } from "../ui/locales/en.js";
import { LazyConnectModal } from "../ui/ConnectWallet/Modal/LazyConnectModal.js";

export type ThirdwebProviderProps = {
  children?: React.ReactNode;
  wallets?: WalletConfig[];
  autoConnect?: boolean;
  client: ThirdwebClient;
  locale?: ThirdwebLocale;
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
                      const chainId = getChainIdFromChain(
                        getChainIdFromChain(variables.contract.chain),
                      ).toString();
                      return queryClient.invalidateQueries({
                        queryKey: [
                          // invalidate any readContract queries for this chainId:contractAddress
                          [
                            "readContract",
                            chainId,
                            variables.contract.address,
                          ] as const,
                          // invalidate any walletBalance queries for this chainId
                          // TODO: add wallet address in here if we can get it somehow
                          ["walletBalance", chainId] as const,
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
      <WalletUIStatesProvider theme="dark">
        <ThirdwebLocaleContext.Provider value={props.locale || en()}>
          <ThirdwebProviderContext.Provider
            value={{
              wallets: props.wallets || defaultWallets,
              client: props.client,
            }}
          >
            {props.autoConnect === false ? <NoAutoConnect /> : <AutoConnect />}
            <LazyConnectModal />
            {props.children}
          </ThirdwebProviderContext.Provider>
        </ThirdwebLocaleContext.Provider>
      </WalletUIStatesProvider>
    </QueryClientProvider>
  );
}
