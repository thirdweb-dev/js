import { type CreateConnectorFn, createConnector } from "@wagmi/core";
import type { Prettify } from "@wagmi/core/chains";
import {
  type Chain,
  defineChain,
  getAddress,
  type ThirdwebClient,
} from "thirdweb";
import {
  EIP1193,
  ecosystemWallet,
  type InAppWalletConnectionOptions,
  type InAppWalletCreationOptions,
  type MultiStepAuthArgsType,
  type SingleStepAuthArgsType,
  inAppWallet as thirdwebInAppWallet,
  type Wallet,
} from "thirdweb/wallets";

export type InAppWalletParameters = Prettify<
  InAppWalletCreationOptions & {
    client: ThirdwebClient;
    ecosystemId?: `ecosystem.${string}`;
    onConnect?: (wallet: Wallet) => void;
  }
>;
export type InAppWalletConnector = ReturnType<typeof inAppWalletConnector>;
type BaseConnectionOptions<withCapabilities extends boolean = false> = {
  chainId?: number | undefined;
  isReconnecting?: boolean | undefined;
  withCapabilities?: withCapabilities | boolean | undefined;
};
export type ConnectionOptions<withCapabilities extends boolean = false> =
  | (MultiStepAuthArgsType & BaseConnectionOptions<withCapabilities>)
  | (SingleStepAuthArgsType & BaseConnectionOptions<withCapabilities>)
  | ({
      strategy?: undefined;
      wallet: Wallet;
    } & BaseConnectionOptions<withCapabilities>);

type Provider = EIP1193.EIP1193Provider | undefined;
type Properties = {
  connect<withCapabilities extends boolean = false>(
    parameters?: ConnectionOptions<withCapabilities> | undefined,
  ): Promise<{
    accounts: withCapabilities extends true
      ? readonly {
          address: `0x${string}`;
          capabilities: Record<string, unknown>;
        }[]
      : readonly `0x${string}`[];
    chainId: number;
  }>;
};
type StorageItem = {
  "thirdweb:lastChainId": number;
};

const activeWalletIdKey = "thirdweb:active-wallet-id";
const connectedWalletIdsKey = "thirdweb:connected-wallet-ids";
const activeChainIdKey = "thirdweb:active-chain";

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
  let wallet: Wallet = args.ecosystemId
    ? ecosystemWallet(args.ecosystemId, { partnerId: args.partnerId })
    : thirdwebInAppWallet(args);
  const client = args.client;
  const rawStorage =
    typeof window !== "undefined" && window.localStorage
      ? window.localStorage
      : undefined;
  return createConnector((config) => ({
    connect: async (params) => {
      wallet =
        params && "wallet" in params ? (params.wallet as Wallet) : wallet;
      const lastChainIdStr = rawStorage?.getItem(activeChainIdKey);
      const lastChain = lastChainIdStr
        ? (JSON.parse(lastChainIdStr) as Chain)
        : undefined;
      const lastChainId = lastChain ? lastChain.id : undefined;
      if (params?.isReconnecting) {
        const { autoConnect } = await import("thirdweb/wallets");
        const chainId = lastChainId || args.smartAccount?.chain?.id || 1;
        await autoConnect({
          chain: defineChain(chainId),
          client,
          wallets: [wallet],
          onConnect: args.onConnect,
        });

        const account = wallet.getAccount();
        if (!account) {
          throw new Error("Wallet failed to reconnect");
        }
        return {
          accounts: [getAddress(account.address)] as any,
          chainId: chainId,
        };
      }

      // if the wallet is already connected, return the account
      const alreadyConnectedAccount = wallet.getAccount();
      if (alreadyConnectedAccount) {
        return {
          accounts: [getAddress(alreadyConnectedAccount.address)] as any,
          chainId: wallet.getChain()?.id || 1,
        };
      }

      // otherwise, connect the wallet
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
        chain,
        client,
      } as InAppWalletConnectionOptions;

      const account = await wallet.connect(decoratedOptions);
      // setting up raw local storage value for autoConnect
      if (rawStorage) {
        const connectedWalletIds = rawStorage?.getItem(connectedWalletIdsKey);
        if (connectedWalletIds) {
          const connectedWalletIdsArray = JSON.parse(connectedWalletIds);
          if (Array.isArray(connectedWalletIdsArray)) {
            if (!connectedWalletIdsArray.includes(wallet.id)) {
              connectedWalletIdsArray.push(wallet.id);
              rawStorage.setItem(
                connectedWalletIdsKey,
                JSON.stringify(connectedWalletIdsArray),
              );
            }
          }
        } else {
          rawStorage.setItem(
            connectedWalletIdsKey,
            JSON.stringify([wallet.id]),
          );
        }
        rawStorage.setItem(activeWalletIdKey, wallet.id);
      }
      args.onConnect?.(wallet);
      return {
        accounts: [getAddress(account.address)] as any,
        chainId: chain.id,
      };
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
      const lastChainIdStr = await rawStorage?.getItem(activeChainIdKey);
      const lastChainId = lastChainIdStr ? Number(lastChainIdStr) : undefined;
      const chain = defineChain(
        params?.chainId || args.smartAccount?.chain?.id || lastChainId || 1,
      );
      if (!wallet.getAccount()) {
        const { autoConnect } = await import("thirdweb/wallets");
        await autoConnect({
          chain,
          client,
          wallets: [wallet],
          onConnect: args.onConnect,
        });
      }
      return EIP1193.toProvider({
        chain: wallet.getChain() || chain,
        client,
        wallet,
      });
    },
    icon: args.metadata?.icon,
    id: "in-app-wallet",
    isAuthorized: async () => {
      const connectedWalletIds = rawStorage?.getItem(connectedWalletIdsKey);
      if (connectedWalletIds) {
        const connectedWalletIdsArray = JSON.parse(connectedWalletIds);
        if (connectedWalletIdsArray.includes(wallet.id)) {
          return true;
        }
      }
      return false;
    },
    name: args.metadata?.name || "In-App wallet",
    onAccountsChanged: () => {
      // no-op
    }, // always try to reconnect
    onChainChanged: () => {
      // no-op
    },
    onDisconnect: () => {
      // no-op
    },
    switchChain: async (params) => {
      const chain = config.chains.find((x) => x.id === params.chainId);
      if (!chain) {
        throw new Error(`Chain ${params.chainId} not configured`);
      }
      await wallet.switchChain(defineChain(chain.id));
      config.emitter.emit("change", {
        chainId: chain.id,
      });
      rawStorage?.setItem(
        activeChainIdKey,
        JSON.stringify(defineChain(chain.id)),
      );
      return chain;
    },
    type: "in-app",
  }));
}
