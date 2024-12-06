import { EventEmitter } from "stream";
import { type CreateConnectorFn, createConnector } from "@wagmi/core";
import type { Prettify } from "@wagmi/core/chains";
import { createThirdwebClient, defineChain, getAddress } from "thirdweb";
import {
  EIP1193,
  type InAppWalletConnectionOptions,
  ecosystemWallet,
  inAppWallet as thirdwebInAppWallet,
} from "thirdweb/wallets";
import type { InAppWalletCreationOptions } from "thirdweb/wallets/in-app";

export type InAppWalletParameters = Prettify<
  Omit<InAppWalletConnectionOptions, "client"> &
    InAppWalletCreationOptions & {
      clientId: string;
      ecosystemId?: `ecosystem.${string}`;
    }
>;

type Provider = EIP1193.EIP1193Provider | undefined;
type Properties = {
  connect(parameters?: {
    chainId?: number | undefined;
    isReconnecting?: boolean | undefined;
    foo?: string;
  }): Promise<{
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
 *
 * export const config = createConfig({
 *  chains: [sepolia],
 *  connectors: [
 *    inAppWalletConnector({
 *      clientId: "...",
 *      strategy: "google",
 *   }),
 *  ],
 *  transports: {
 *    [sepolia.id]: http(),
 *  },
 * });
 * ```
 */
export function inAppWalletConnector(
  args: InAppWalletParameters,
): CreateConnectorFn<Provider, Properties, StorageItem> {
  const client = createThirdwebClient({ clientId: args.clientId });
  const wallet = args.ecosystemId
    ? ecosystemWallet(args.ecosystemId, { partnerId: args.partnerId })
    : thirdwebInAppWallet(args);
  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: "in-app-wallet",
    name: "In-App wallet",
    type: "in-app",
    connect: async (params) => {
      const inAppOptions = params && "client" in params ? params : undefined;
      const wagmiConnectOptions =
        params && "chainId" in params ? params : undefined;
      console.log("inAppOPtions", inAppOptions);
      console.log("wagmiConnectOptions", wagmiConnectOptions);
      const lastChainId = await config.storage?.getItem("tw.lastChainId");
      const chain = defineChain(
        wagmiConnectOptions?.chainId || lastChainId || 1,
      );
      const options = {
        client,
        chain,
        ...args,
      } as unknown as InAppWalletConnectionOptions;
      const account = wagmiConnectOptions?.isReconnecting
        ? await wallet.autoConnect({
            client,
            chain,
          })
        : await wallet.connect(options);
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
      return EIP1193.toProvider({
        wallet,
        client,
        chain: wallet.getChain() || defineChain(params?.chainId || 1),
      });
    },
    isAuthorized: async () => true,
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

const c = inAppWalletConnector({
  clientId: "...",
  strategy: "google",
})({
  chains: [sepolia],
  emitter: new EventEmitter() as any,
});

c.connect({});
