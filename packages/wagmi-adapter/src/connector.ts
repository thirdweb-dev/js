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
type StorageItem = {
  "thirdweb:lastChainId": number;
};

const activeWalletIdKey = "thirdweb:active-wallet-id";
const connectedWalletIdsKey = "thirdweb:connected-wallet-ids";

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
 *      smartAccount: {
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
    name: args.metadata?.name || "In-App wallet",
    type: "in-app",
    icon: args.metadata?.image?.src,
    connect: async (params) => {
      const rawStorage =
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage
          : undefined;
      const lastChainId = await config.storage?.getItem("thirdweb:lastChainId");
      if (params?.isReconnecting) {
        const { autoConnect } = await import("thirdweb/wallets");
        const chainId = lastChainId || args.smartAccount?.chain?.id || 1;
        await autoConnect({
          client,
          chain: defineChain(chainId),
          wallets: [wallet],
        });

        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Wallet failed to reconnect");
        }

        return {
          accounts: [getAddress(account.address)],
          chainId: chainId,
        };
      }
      const inAppOptions = params && "strategy" in params ? params : undefined;
      if (!inAppOptions) {
        throw new Error(
          "Missing strategy prop, pass it to connect() when connecting to this connector",
        );
      }
      const chain = defineChain(
        inAppOptions?.chainId ||
          lastChainId ||
          args.smartAccount?.chain?.id ||
          1,
      );
      const decoratedOptions = {
        ...inAppOptions,
        client,
        chain,
      } as InAppWalletConnectionOptions;
      const account = await wallet.connect(decoratedOptions);
      // setting up raw local storage value for autoConnect
      rawStorage?.setItem(connectedWalletIdsKey, JSON.stringify([wallet.id]));
      rawStorage?.setItem(activeWalletIdKey, wallet.id);
      await config.storage?.setItem("thirdweb:lastChainId", chain.id);
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
      const lastChainId = await config.storage?.getItem("thirdweb:lastChainId");
      const chain = defineChain(
        params?.chainId || args.smartAccount?.chain?.id || lastChainId || 1,
      );
      if (!wallet.getAccount()) {
        const { autoConnect } = await import("thirdweb/wallets");
        await autoConnect({
          client,
          chain,
          wallets: [wallet],
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
        throw new Error(`Chain ${params.chainId} not configured`);
      }
      await wallet.switchChain(defineChain(chain.id));
      config.emitter.emit("change", {
        chainId: chain.id,
      });
      await config.storage?.setItem("thirdweb:lastChainId", chain.id);
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
