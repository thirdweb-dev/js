import { trackConnect } from "../../../../analytics/track.js";
import type { Chain } from "../../../../chains/types.js";
import { getCachedChainIfExists } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import { createWalletEmitter } from "../../../wallet-emitter.js";
import type {
  CreateWalletArgs,
  EcosystemWalletId,
} from "../../../wallet-types.js";
import type { InAppConnector } from "../interfaces/connector.js";
import type { Ecosystem } from "./types.js";

const connectorCache = new Map<string, InAppConnector>();

/**
 * @internal
 */
export async function getOrCreateInAppWalletConnector(
  client: ThirdwebClient,
  connectorFactory: (client: ThirdwebClient) => Promise<InAppConnector>,
  ecosystem?: Ecosystem,
) {
  const key = JSON.stringify({ clientId: client.clientId, ecosystem });
  if (connectorCache.has(key)) {
    return connectorCache.get(key) as InAppConnector;
  }
  const connector = await connectorFactory(client);
  connectorCache.set(key, connector);
  return connector;
}

/**
 * @internal
 */
export function createInAppWallet(args: {
  createOptions?: CreateWalletArgs<"inApp">[1];
  connectorFactory: (client: ThirdwebClient) => Promise<InAppConnector>;
  ecosystem?: Ecosystem;
}): Wallet<"inApp" | EcosystemWalletId> {
  const { createOptions, connectorFactory, ecosystem } = args;
  const walletId = ecosystem ? ecosystem.id : "inApp";
  const emitter = createWalletEmitter<"inApp">();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  let client: ThirdwebClient | undefined;

  return {
    id: walletId,
    subscribe: emitter.subscribe,
    getChain() {
      if (!chain) {
        return undefined;
      }

      chain = getCachedChainIfExists(chain.id) || chain;
      return chain;
    },
    getConfig: () => createOptions,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { autoConnectInAppWallet } = await import("./index.js");

      const connector = await getOrCreateInAppWalletConnector(
        options.client,
        connectorFactory,
        ecosystem,
      );
      const [connectedAccount, connectedChain] = await autoConnectInAppWallet(
        options,
        createOptions,
        connector,
      );

      // set the states
      client = options.client;
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: walletId,
        walletAddress: account.address,
      });
      // return only the account
      return account;
    },
    connect: async (options) => {
      const { connectInAppWallet } = await import("./index.js");
      const connector = await getOrCreateInAppWalletConnector(
        options.client,
        connectorFactory,
        ecosystem,
      );

      const [connectedAccount, connectedChain] = await connectInAppWallet(
        options,
        createOptions,
        connector,
      );
      // set the states
      client = options.client;
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: walletId,
        walletAddress: account.address,
      });
      // return only the account
      return account;
    },
    disconnect: async () => {
      // If no client is assigned, we should be fine just unsetting the states
      if (client) {
        const connector = await getOrCreateInAppWalletConnector(
          client,
          connectorFactory,
          ecosystem,
        );
        const result = await connector.logout();
        if (!result.success) {
          throw new Error("Failed to logout");
        }
      }
      account = undefined;
      chain = undefined;
      emitter.emit("disconnect", undefined);
    },
    switchChain: async (newChain) => {
      if (createOptions?.smartAccount && client && account) {
        // if account abstraction is enabled, reconnect to smart account on the new chain
        const { autoConnectInAppWallet } = await import("./index.js");
        const connector = await getOrCreateInAppWalletConnector(
          client,
          connectorFactory,
          ecosystem,
        );
        const [connectedAccount, connectedChain] = await autoConnectInAppWallet(
          {
            chain: newChain,
            client,
          },
          createOptions,
          connector,
        );
        account = connectedAccount;
        chain = connectedChain;
      } else {
        // if not, simply set the new chain
        chain = newChain;
      }
      emitter.emit("chainChanged", newChain);
    },
  };
}
