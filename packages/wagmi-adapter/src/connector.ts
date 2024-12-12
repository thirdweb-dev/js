import { type CreateConnectorFn, createConnector } from "@wagmi/core";
import type { Prettify } from "@wagmi/core/chains";
import { type ThirdwebClient, defineChain, getAddress } from "thirdweb";
import {
  EIP1193,
  type InAppWalletConnectionOptions,
  type InAppWalletCreationOptions,
  type MultiStepAuthArgsType,
  type SingleStepAuthArgsType,
  ecosystemWallet,
  inAppWallet as thirdwebInAppWallet,
} from "thirdweb/wallets";

export type InAppWalletParameters = Prettify<
  InAppWalletCreationOptions & {
    client: ThirdwebClient;
    ecosystemId?: `ecosystem.${string}`;
  }
>;
export type InAppWalletConnector = ReturnType<typeof inAppWalletConnector>;
export type ConnectionOptions = Prettify<
  (MultiStepAuthArgsType | SingleStepAuthArgsType) & {
    chainId?: number | undefined;
    isReconnecting?: boolean | undefined;
  }
>;

type Provider = EIP1193.EIP1193Provider | undefined;
type Properties = {
  connect(parameters?: ConnectionOptions): Promise<{
    accounts: readonly `0x${string}`[];
    chainId: number;
  }>;
};
type StorageItem = { "tw.lastChainId": number };

/**
 * Connect to an in-app wallet using the auth strategy of your choice.
 * @param args - Options for the in-app wallet connection.
 * @returns A wagmi connector.
 * @example
 * ```ts
 * import { http, createConfig } from "wagmi";
 * import { inAppWalletConnector } from "@thirdweb-dev/wagmi-adapter";
 * import { createThirdwebClient, defineChain as thirdwebChain } from "thirdweb";
 *
 * const client = createThirdwebClient({
 *   clientId: "...",
 * });
 *
 * export const config = createConfig({
 *  chains: [sepolia],
 *  connectors: [
 *    inAppWalletConnector({
 *      client,
 *      // optional: turn on smart accounts
 *      smartAccounts: {
 *         sponsorGas: true,
 *         chain: thirdwebChain(sepolia)
 *      }
 *   }),
 *  ],
 *  transports: {
 *    [sepolia.id]: http(),
 *  },
 * });
 * ```
 *
 * Then in your app, you can use the connector to connect with any supported strategy:
 *
 * ```ts
 * const { connect, connectors } = useConnect();
 *
 * const onClick = () => {
 *   const inAppWallet = connectors.find((x) => x.id === "in-app-wallet");
 *   connect({
 *     connector: inAppWallet, strategy: "google"
 *   });
 * };
 * ```
 * @beta
 */
export function inAppWalletConnector(
  args: InAppWalletParameters,
): CreateConnectorFn<Provider, Properties, StorageItem> {
  const wallet = args.ecosystemId
    ? ecosystemWallet(args.ecosystemId, { partnerId: args.partnerId })
    : thirdwebInAppWallet(args);
  const client = args.client;
  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: "in-app-wallet",
    name: "In-App wallet",
    type: "in-app",
    connect: async (params) => {
      const lastChainId = await config.storage?.getItem("tw.lastChainId");
      if (params?.isReconnecting) {
        const account = await wallet.autoConnect({
          client,
          chain: defineChain(lastChainId || 1),
        });
        return {
          accounts: [getAddress(account.address)],
          chainId: lastChainId || 1,
        };
      }
      const inAppOptions = params && "strategy" in params ? params : undefined;
      if (!inAppOptions) {
        throw new Error(
          "Missing strategy prop, pass it to connect() when connecting to this connector",
        );
      }
      const chain = defineChain(inAppOptions?.chainId || lastChainId || 1);
      const decoratedOptions = {
        ...inAppOptions,
        client,
        chain,
      } as InAppWalletConnectionOptions;
      const account = await wallet.connect(decoratedOptions);
      await config.storage?.setItem("tw.lastChainId", chain.id);
      return { accounts: [getAddress(account.address)], chainId: chain.id };
    },
    disconnect: async () => {
      await wallet.disconnect();
    },
    getAccounts: async () => {
      const account = wallet.getAccount();
      if (!account) {
        throw new Error("Wallet not connected");
      }
      return [getAddress(account.address)];
    },
    getChainId: async () => {
      return wallet.getChain()?.id || 1;
    },
    getProvider: async (params) => {
      const lastChainId = await config.storage?.getItem("tw.lastChainId");
      const chain = defineChain(params?.chainId || lastChainId || 1);
      if (!wallet.getAccount()) {
        await wallet.autoConnect({
          client,
          chain,
        });
      }
      return EIP1193.toProvider({
        wallet,
        client,
        chain: wallet.getChain() || chain,
      });
    },
    isAuthorized: async () => true, // always try to reconnect
    switchChain: async (params) => {
      const chain = config.chains.find((x) => x.id === params.chainId);
      if (!chain) {
        throw new Error(`Chain ${params.chainId} not supported`);
      }
      await wallet.switchChain(defineChain(chain.id));
      return chain;
    },
    onAccountsChanged: () => {
      // no-op
    },
    onChainChanged: () => {
      // no-op
    },
    onDisconnect: () => {
      // no-op
    },
  }));
}
