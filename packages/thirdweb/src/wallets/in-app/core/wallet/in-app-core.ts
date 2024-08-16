import { trackConnect } from "../../../../analytics/track.js";
import type { Chain } from "../../../../chains/types.js";
import { getCachedChainIfExists } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import { createWalletEmitter } from "../../../wallet-emitter.js";
import type { CreateWalletArgs } from "../../../wallet-types.js";
import type { Ecosystem } from "../../web/types.js";
import {
  getLinkedProfilesInternal,
  linkAccount as linkProfileWithToken,
} from "../authentication/linkAccount.js";
import type {
  MultiStepAuthArgsType,
  Profile,
  SingleStepAuthArgsType,
} from "../authentication/types.js";
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
    getChain() {
      if (!chain) {
        return undefined;
      }

      chain = getCachedChainIfExists(chain.id) || chain;
      return chain;
    },
    getConfig: () => createOptions,
    getAccount: () => account,
    /**
     * @description
     * Gets the linked profiles for the current wallet.
     * This method is only available for in-app or ecosystem wallets.
     *
     * @returns An array of accounts user profiles linked to the current wallet.
     *
     * @example
     * ```ts
     * import { inAppWallet } from "thirdweb/wallets";
     *
     * const wallet = inAppWallet();
     * wallet.connect({ strategy: "google" });
     *
     * const profiles = wallet.getProfiles();
     *
     * console.log(profiles[0].type);
     * console.log(profiles[0].details.email);
     * ```
     */
    getProfiles: async () => {
      if (!client) {
        return [];
      }

      return getLinkedProfilesInternal({ client });
    },
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
    // This is not included on the global interface but is force-resolved in linkProfile
    linkProfile: async (
      options: SingleStepAuthArgsType | MultiStepAuthArgsType,
    ): Promise<Profile[]> => {
      if (!client) {
        throw new Error(
          "No client found, please connect the wallet before linking a profile",
        );
      }

      const connector = await getOrCreateInAppWalletConnector(
        client,
        connectorFactory,
      );

      const { storedToken } = await connector.authenticate(options);
      return await linkProfileWithToken({
        client,
        tokenToLink: storedToken.cookieString,
      });
    },
  } as Wallet<"inApp">;
}
