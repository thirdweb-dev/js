import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AutoConnect,
  NoAutoConnect,
} from "../hooks/connection/useAutoConnect.js";
import type { WalletConfig } from "../types/wallets.js";
import { useState } from "react";
import type { ThirdwebClient } from "../../client/client.js";
import { isObjectWithKeys } from "../../utils/type-guards.js";
import {
  waitForReceipt,
  type WaitForReceiptOptions,
} from "../../transaction/actions/wait-for-tx-receipt.js";
import type { DAppMetaData } from "../../wallets/types.js";
import { isBaseTransactionOptions } from "../../transaction/types.js";
import { ThirdwebProviderContext } from "./thirdweb-provider-ctx.js";
import { defaultDappMetadata } from "../../wallets/utils/defaultDappMetadata.js";

/**
 * The ThirdwebProvider is component is a provider component that sets up the React Query client and Wallet Connection Manager.
 * To you thirdweb React SDK's hooks and components, you have to wrap your App component in a ThirdwebProvider.
 *
 * `ThirdwebProvider` requires a `client` prop which you can create using the `createThirdwebClient` function.  You must provide a `clientId` or `secretKey` in order to initialize a `client`.
 * You can create an Api key for free at from the [Thirdweb Dashboard](https://thirdweb.com/create-api-key).
 * @param props - The props for the ThirdwebProvider
 * @example
 * ```jsx
 * import { createThirdwebClient } from "thirdweb";
 * import { ThirdwebProvider } from "thirdweb/react";
 *
 * const client = createThirdwebClient({
 *  clientId: "<your_client_id>",
 * })
 *
 * function Example() {
 *  return (
 *    <ThirdwebProvider client={client}>
 *      <App />
 *    </ThirdwebProvider>
 *   )
 * }
 * ```
 * @component
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
              if (isBaseTransactionOptions(variables)) {
                if (
                  isObjectWithKeys(data, ["transactionHash", "transaction"]) ||
                  isObjectWithKeys(data, ["userOpHash", "transaction"])
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
                            variables.contract.chain.id,
                            variables.contract.address,
                          ] as const,
                          // invalidate any walletBalance queries for this chainId
                          // TODO: add wallet address in here if we can get it somehow
                          [
                            "walletBalance",
                            variables.contract.chain.id,
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
      <ThirdwebProviderContext.Provider
        value={{
          wallets: props.wallets,
          client: props.client,
          dappMetadata: props.dappMetadata || defaultDappMetadata,
        }}
      >
        {props.autoConnect === false ? <NoAutoConnect /> : <AutoConnect />}
        {props.children}
      </ThirdwebProviderContext.Provider>
    </QueryClientProvider>
  );
}

export type ThirdwebProviderProps = {
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  /**
   * Wrap component in ThirdwebProvider to use thirdweb hooks and components inside that component.
   * @example
   * ```tsx
   * <ThirdwebProvider client={client}>
   *  <App />
   * </ThirdwebProvider>
   * ```
   */
  children?: React.ReactNode;
  /**
   * Array of supported wallets. If not provided, default wallets will be used.
   *
   * Wallets provided here appear in the `ConnectButton`'s Modal or in `ConnectEmbed` component's UI
   * @example
   * ```tsx
   * import { metamaskConfig, coinbaseConfig, walletConnectConfig } from "thirdweb/react";
   *
   * function Example() {
   *  return (
   *    <ThirdwebProvider client={client}
   *       wallets={[
   *         metamaskConfig(),
   *         coinbaseConfig(),
   *         walletConnectConfig(),
   *       ]}>
   *      <App />
   *    </ThirdwebProvider>
   *  )
   * }
   * ```
   *
   * If no wallets are specified. Below wallets will be used by default:
   *
   * - [Embedded Wallet](https://portal.thirdweb.com/references/typescript/v5/embeddedWalletConfig)
   * - [MataMask Wallet](https://portal.thirdweb.com/references/typescript/v5/metamaskConfig)
   * - [Coinbase Wallet](https://portal.thirdweb.com/references/typescript/v5/coinbaseConfig)
   * - [WalletConnect](https://portal.thirdweb.com/references/typescript/v5/walletConnectConfig)
   * - [rainbowConfig](https://portal.thirdweb.com/references/typescript/v5/rainbowConfig)
   * - [zerionConfig](https://portal.thirdweb.com/references/typescript/v5/zerionConfig)
   */
  wallets: WalletConfig[];

  /**
   * When the user has connected their wallet to your site, this flag determines whether or not you want to automatically connect to the last connected wallet when user visits your site again in the future.
   *
   * By default it is set to `true`
   */
  autoConnect?: boolean;

  /**
   * Metadata of the dApp that will be passed to connected wallet.
   *
   * Some wallets may display this information to the user.
   *
   * Setting this property is highly recommended. If this is not set, Below default metadata will be used:
   *
   * ```ts
   * {
   *   name: "thirdweb powered dApp",
   *   url: "https://thirdweb.com",
   *   description: "thirdweb powered dApp",
   *   logoUrl: "https://thirdweb.com/favicon.ico",
   * };
   * ```
   */
  dappMetadata?: DAppMetaData;
};
