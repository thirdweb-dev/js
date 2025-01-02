import { trackConnect } from "../../../../analytics/track/connect.js";
import type { Chain } from "../../../../chains/types.js";
import {
  getCachedChain,
  getCachedChainIfExists,
} from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { stringify } from "../../../../utils/json.js";
import { getEcosystemInfo } from "../../../ecosystem/get-ecosystem-wallet-auth-options.js";
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
  const key = stringify({ clientId: client.clientId, ecosystem });
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
  const { createOptions: _createOptions, connectorFactory, ecosystem } = args;
  const walletId = ecosystem ? ecosystem.id : "inApp";
  const emitter = createWalletEmitter<"inApp">();
  let createOptions = _createOptions;
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

      if (ecosystem) {
        const ecosystemOptions = await getEcosystemInfo(ecosystem.id);
        const smartAccountOptions = ecosystemOptions?.smartAccountOptions;
        if (smartAccountOptions) {
          const { defaultChainId } = ecosystemOptions.smartAccountOptions;
          const preferredChain =
            options.chain ??
            (defaultChainId ? getCachedChain(defaultChainId) : undefined);
          if (!preferredChain) {
            throw new Error(
              `A chain must be provided either via 'chain' in connect options or 'defaultChainId' in ecosystem configuration. Please pass it via connect() or update the ecosystem configuration.`,
            );
          }

          createOptions = {
            ...createOptions,
            smartAccount: {
              chain: preferredChain,
              sponsorGas: smartAccountOptions.sponsorGas,
              factoryAddress: smartAccountOptions.accountFactoryAddress,
            },
          };
        }
      }

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
        ecosystem,
        walletType: walletId,
        walletAddress: account.address,
        chainId: chain.id,
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

      if (ecosystem) {
        const ecosystemOptions = await getEcosystemInfo(ecosystem.id);
        const smartAccountOptions = ecosystemOptions?.smartAccountOptions;
        if (smartAccountOptions) {
          const { defaultChainId } = ecosystemOptions.smartAccountOptions;
          const preferredChain =
            options.chain ??
            (defaultChainId ? getCachedChain(defaultChainId) : undefined);
          if (!preferredChain) {
            throw new Error(
              `A chain must be provided either via 'chain' in connect options or 'defaultChainId' in ecosystem configuration. Please pass it via connect() or update the ecosystem configuration.`,
            );
          }

          createOptions = {
            ...createOptions,
            smartAccount: {
              chain: preferredChain,
              sponsorGas: smartAccountOptions.sponsorGas,
              factoryAddress: smartAccountOptions.accountFactoryAddress,
            },
          };
        }
      }

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
        ecosystem,
        walletType: walletId,
        walletAddress: account.address,
        chainId: chain.id,
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

        if (ecosystem) {
          const ecosystemOptions = await getEcosystemInfo(ecosystem.id);
          const smartAccountOptions = ecosystemOptions?.smartAccountOptions;
          if (smartAccountOptions) {
            createOptions = {
              ...createOptions,
              smartAccount: {
                chain: newChain,
                sponsorGas: smartAccountOptions.sponsorGas,
                factoryAddress: smartAccountOptions.accountFactoryAddress,
              },
            };
          }
        }

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
