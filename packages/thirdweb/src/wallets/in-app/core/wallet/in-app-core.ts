import { trackConnect } from "../../../../analytics/track.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import { createWalletEmitter } from "../../../wallet-emitter.js";
import type { CreateWalletArgs } from "../../../wallet-types.js";
import type { Ecosystem } from "../../web/types.js";
import type { InAppConnector } from "../interfaces/connector.js";

const connectorCache = new WeakMap<
  { client: ThirdwebClient; ecosystem?: Ecosystem },
  InAppConnector
>();

/**
 * @internal
 */
export async function getOrCreateInAppWalletConnector(
  client: ThirdwebClient,
  connectorFactory: (client: ThirdwebClient) => Promise<InAppConnector>,
  ecosystem?: Ecosystem,
) {
  const key = { client, ecosystem };
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
}): Wallet<"inApp"> {
  const { createOptions, connectorFactory } = args;
  const emitter = createWalletEmitter<"inApp">();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  let client: ThirdwebClient | undefined;

  return {
    id: "inApp",
    subscribe: emitter.subscribe,
    getChain: () => chain,
    getConfig: () => createOptions,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { autoConnectInAppWallet } = await import("./index.js");

      const connector = await getOrCreateInAppWalletConnector(
        options.client,
        connectorFactory,
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
        walletType: "inApp",
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
        walletType: "inApp",
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
