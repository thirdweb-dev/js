import type { Chain } from "../chains/types.js";
import type {
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "./__generated__/wallet-ids.js";
import type { Account, Wallet } from "./interfaces/wallet.js";
import type {
  CreateWalletArgs,
  EcosystemWalletId,
  InjectedConnectOptions,
  WalletAutoConnectionOption,
  WalletId,
} from "./wallet-types.js";

import { trackConnect } from "../analytics/track.js";
import { webLocalStorage } from "../utils/storage/webStorage.js";
import { isMobile } from "../utils/web/isMobile.js";
import { openWindow } from "../utils/web/openWindow.js";
import { coinbaseWalletSDK } from "./coinbase/coinbase-wallet.js";
import { getCoinbaseWebProvider } from "./coinbase/coinbaseWebSDK.js";
import { COINBASE } from "./constants.js";
import { isEcosystemWallet } from "./ecosystem/is-ecosystem-wallet.js";
import { ecosystemWallet } from "./in-app/web/ecosystem.js";
import { inAppWallet } from "./in-app/web/in-app.js";
import { smartWallet } from "./smart/smart-wallet.js";
import type { WCConnectOptions } from "./wallet-connect/types.js";
import { createWalletEmitter } from "./wallet-emitter.js";

// TODO: figure out how to define the type without tuple args type and using function overloads

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
      return smartWallet(
        creationOptions as CreateWalletArgs<"smart">[1],
      ) as Wallet<ID>;
    }
    /**
     * IN-APP WALLET
     */
    case id === "embedded" || id === "inApp": {
      return inAppWallet(
        creationOptions as CreateWalletArgs<"inApp">[1],
      ) as Wallet<ID>;
    }

    /**
     * COINBASE WALLET VIA SDK
     * -> if no injected coinbase found, we'll use the coinbase SDK
     */
    case id === COINBASE: {
      const options = creationOptions as CreateWalletArgs<typeof COINBASE>[1];
      return coinbaseWalletSDK({
        createOptions: options,
        providerFactory: () => getCoinbaseWebProvider(options),
        onConnectRequested: async (provider) => {
          // on the web, make sure to show the coinbase popup IMMEDIATELY on connection requested
          // otherwise the popup might get blocked in safari
          // TODO awaiting the provider is fast only thanks to preloading that happens in our components
          // these probably need to actually imported / created synchronously to be used headless properly
          const { showCoinbasePopup } = await import("./coinbase/utils.js");
          return showCoinbasePopup(provider);
        },
      }) as Wallet<ID>;
    }
    case isEcosystemWallet(id):
      return ecosystemWallet(
        ...(args as CreateWalletArgs<EcosystemWalletId>),
      ) as Wallet<ID>;

    /**
     * WALLET CONNECT AND INJECTED WALLETS + walletConnect standalone
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

      // on mobile, deeplink to the wallet app for session handling
      const sessionHandler = isMobile()
        ? (uri: string) => openWindow(uri)
        : undefined;

      const wallet: Wallet<ID> = {
        id,
        subscribe: emitter.subscribe,
        getConfig: () => args[1],
        getChain: () => chain,
        getAccount: () => account,
        autoConnect: async (
          options: WalletAutoConnectionOption<
            WCSupportedWalletIds | InjectedSupportedWalletIds
          >,
        ) => {
          const { injectedProvider } = await import("./injected/mipdStore.js");
          // injected wallet priority for autoConnect
          if (id !== "walletConnect" && injectedProvider(id)) {
            const { autoConnectInjectedWallet } = await import(
              "./injected/index.js"
            );

            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await autoConnectInjectedWallet(
              id as InjectedSupportedWalletIds,
              emitter,
              options.chain,
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

          if (options && "client" in options) {
            const { autoConnectWC } = await import(
              "./wallet-connect/controller.js"
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
              webLocalStorage,
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
              "./wallet-connect/controller.js"
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
              webLocalStorage,
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

          // prefer walletconnect over injected if explicitely passing walletConnect options
          const forceWalletConnectOption =
            options && "walletConnect" in options;

          const { injectedProvider } = await import("./injected/mipdStore.js");
          if (injectedProvider(id) && !forceWalletConnectOption) {
            const { connectInjectedWallet } = await import(
              "./injected/index.js"
            );

            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await connectInjectedWallet(
              id as InjectedSupportedWalletIds,
              options as InjectedConnectOptions,
              emitter,
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
