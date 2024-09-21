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
import { getOrCreateInAppWalletConnector } from "./in-app-core.js";

/**
 * @internal
 */
export function createEcosystemWallet(args: {
  id: EcosystemWalletId;
  createOptions: CreateWalletArgs<EcosystemWalletId>[1];
  connectorFactory: (client: ThirdwebClient) => Promise<InAppConnector>;
}): Wallet<EcosystemWalletId> {
  // Under the hood, an ecosystem wallet wraps an in-app wallet
  const { id, createOptions, connectorFactory } = args;
  const emitter = createWalletEmitter<EcosystemWalletId>();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  let client: ThirdwebClient | undefined;
  const ecosystem: Ecosystem = {
    id,
    partnerId: createOptions?.partnerId,
  };

  return {
    id,
    subscribe: emitter.subscribe,
    getChain() {
      if (!chain) {
        return undefined;
      }

      chain = getCachedChainIfExists(chain.id) || chain;
      return chain;
    },
    getConfig: () => createOptions,
    getProfiles: async () => {
      if (!client) {
        return [];
      }

      return getLinkedProfilesInternal({ client, ecosystem });
    },
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
        walletType: id,
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
        walletType: id,
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
      chain = newChain;
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
        ecosystem,
      );

      const { storedToken } = await connector.authenticate(options);
      return await linkProfileWithToken({
        client,
        ecosystem,
        tokenToLink: storedToken.cookieString,
      });
    },
  } as Wallet<EcosystemWalletId>;
}
