// TODO: figure out how to define the type without tuple args type and using function overloads

import { Linking } from "react-native";
import { trackConnect } from "../../analytics/track.js";
import type { Chain } from "../../chains/types.js";
import { nativeLocalStorage } from "../../utils/storage/nativeStorage.js";
import type { WCSupportedWalletIds } from "../__generated__/wallet-ids.js";
import { coinbaseWalletSDK } from "../coinbase/coinbase-wallet.js";
import { getCoinbaseMobileProvider } from "../coinbase/coinbaseMobileSDK.js";
import { COINBASE } from "../constants.js";
import { isEcosystemWallet } from "../ecosystem/is-ecosystem-wallet.js";
import { inAppWallet } from "../in-app/native/in-app.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { smartWallet } from "../smart/smart-wallet.js";
import type { WCConnectOptions } from "../wallet-connect/types.js";
import { createWalletEmitter } from "../wallet-emitter.js";
import type {
  CreateWalletArgs,
  WalletAutoConnectionOption,
  WalletId,
} from "../wallet-types.js";

/**
 * Creates a wallet based on the provided ID and arguments.
 * @param args - The arguments for creating the wallet.
 * @returns - The created wallet.
 * @example
 * ```ts
 * import { createWallet } from "thirdweb/wallets";
 *
 * const metamaskWallet = createWallet("io.metamask");
 *
 * const account = await metamaskWallet.connect({
 *  client,
 * });
 * ```
 * @wallet
 */
export function createWallet<const ID extends WalletId>(
  ...args: CreateWalletArgs<ID>
): Wallet<ID> {
  const [id, creationOptions] = args;

  switch (true) {
    /**
     * SMART WALLET
     */
    case id === "smart": {
      // same as web
      return smartWallet(
        creationOptions as CreateWalletArgs<"smart">[1],
      ) as Wallet<ID>;
    }
    /**
     * IN-APP WALLET
     */
    case id === "embedded":
    case id === "inApp": {
      return inAppWallet(
        creationOptions as CreateWalletArgs<"inApp">[1],
      ) as Wallet<ID>;
    }

    /**
     * ECOSYSTEM WALLETS
     */
    case isEcosystemWallet(id): {
      throw new Error(
        "Ecosystem wallets are not yet supported in the React Native SDK",
      );
    }

    /**
     * COINBASE WALLET VIA SDK
     * -> if no injected coinbase found, we'll use the coinbase SDK
     */
    case id === COINBASE: {
      const options = creationOptions as CreateWalletArgs<typeof COINBASE>[1];
      return coinbaseWalletSDK({
        createOptions: options,
        providerFactory: () => getCoinbaseMobileProvider(options),
      }) as Wallet<ID>;
    }

    /**
     * WALLET CONNECT only in react native for everything else
     */
    default: {
      const emitter = createWalletEmitter<ID>();
      let account: Account | undefined = undefined;
      let chain: Chain | undefined = undefined;

      const unsubscribeChain = emitter.subscribe("chainChanged", (newChain) => {
        chain = newChain;
      });

      function reset() {
        account = undefined;
        chain = undefined;
      }

      let handleDisconnect = async () => {};

      const unsubscribeDisconnect = emitter.subscribe("disconnect", () => {
        reset();
        unsubscribeChain();
        unsubscribeDisconnect();
      });

      emitter.subscribe("accountChanged", (_account) => {
        account = _account;
      });

      let handleSwitchChain: (chain: Chain) => Promise<void> = async () => {
        throw new Error("Not implemented yet");
      };

      const sessionHandler = (uri: string) => Linking.openURL(uri);

      const wallet: Wallet<ID> = {
        id,
        subscribe: emitter.subscribe,
        getConfig: () => args[1],
        getChain: () => chain,
        getAccount: () => account,
        autoConnect: async (
          options: WalletAutoConnectionOption<WCSupportedWalletIds>,
        ) => {
          if (options && "client" in options) {
            const { autoConnectWC } = await import(
              "../wallet-connect/controller.js"
            );
            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await autoConnectWC(
              options,
              emitter,
              wallet.id as WCSupportedWalletIds,
              nativeLocalStorage,
              sessionHandler,
            );
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            handleDisconnect = doDisconnect;
            handleSwitchChain = doSwitchChain;
            trackConnect({
              client: options.client,
              walletType: id,
              walletAddress: account.address,
            });
            // return account
            return account;
          }
          throw new Error("Failed to auto connect");
        },
        connect: async (options) => {
          async function wcConnect(wcOptions: WCConnectOptions) {
            const { connectWC } = await import(
              "../wallet-connect/controller.js"
            );

            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await connectWC(
              wcOptions,
              emitter,
              wallet.id as WCSupportedWalletIds | "walletConnect",
              nativeLocalStorage,
              sessionHandler,
            );
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            handleDisconnect = doDisconnect;
            handleSwitchChain = doSwitchChain;
            trackConnect({
              client: wcOptions.client,
              walletType: id,
              walletAddress: account.address,
            });
            return account;
          }

          if (id === "walletConnect") {
            const { client, chain: _chain, ...walletConnectOptions } = options;

            return wcConnect({
              client,
              chain: _chain,
              walletConnect: {
                ...walletConnectOptions,
              },
            });
          }

          if (options && "client" in options) {
            return wcConnect(options);
          }
          throw new Error("Failed to connect");
        },
        // these get overridden in connect and autoConnect
        disconnect: async () => {
          reset();
          await handleDisconnect();
        },
        switchChain: (c) => handleSwitchChain(c),
      };
      return wallet;
    }
  }
}

/**
 * Creates a wallet that allows connecting to any wallet that supports the WalletConnect protocol.
 * @returns The created smart wallet.
 * @example
 * ```ts
 * import { walletConnect } from "thirdweb/wallets";
 *
 * const wallet = walletConnect();
 *
 * const account = await wallet.connect({
 *  client
 * });
 * ```
 * @wallet
 */
export function walletConnect() {
  return createWallet("walletConnect");
}
