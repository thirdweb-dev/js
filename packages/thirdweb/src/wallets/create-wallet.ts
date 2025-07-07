import { trackConnect } from "../analytics/track/connect.js";
import type { Chain } from "../chains/types.js";
import { getCachedChainIfExists } from "../chains/utils.js";
import { webLocalStorage } from "../utils/storage/webStorage.js";
import { isMobile } from "../utils/web/isMobile.js";
import { openWindow } from "../utils/web/openWindow.js";
import type {
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "./__generated__/wallet-ids.js";
import { coinbaseWalletSDK } from "./coinbase/coinbase-wallet.js";
import { getCoinbaseWebProvider } from "./coinbase/coinbase-web.js";
import { COINBASE } from "./constants.js";
import { isEcosystemWallet } from "./ecosystem/is-ecosystem-wallet.js";
import { ecosystemWallet } from "./in-app/web/ecosystem.js";
import { inAppWallet } from "./in-app/web/in-app.js";
import { getInjectedProvider } from "./injected/index.js";
import type { Account, Wallet } from "./interfaces/wallet.js";
import { smartWallet } from "./smart/smart-wallet.js";
import type { WCConnectOptions } from "./wallet-connect/types.js";
import { createWalletEmitter } from "./wallet-emitter.js";
import type {
  CreateWalletArgs,
  EcosystemWalletId,
  WalletAutoConnectionOption,
  WalletId,
} from "./wallet-types.js";

// TODO: figure out how to define the type without tuple args type and using function overloads

/**
 * Creates a wallet based on the provided ID and arguments.
 *
 * - Supports 500+ wallets
 * - Handles both injected browser wallets and WalletConnect sessions
 *
 * [View all available wallets](https://portal.thirdweb.com/typescript/v5/supported-wallets)
 *
 * @param args - The arguments for creating the wallet.
 * @param args.id - The ID of the wallet to create, this will be autocompleted by your IDE.
 * [View all available wallets](https://portal.thirdweb.com/typescript/v5/supported-wallets)
 * @param args.createOptions - The options for creating the wallet.
 * The arguments are different for each wallet type.
 * Refer to the [WalletCreationOptions](https://portal.thirdweb.com/references/typescript/v5/WalletCreationOptions) type for more details.
 * @returns - The created wallet.
 * @example
 *
 * ## Connecting the wallet
 *
 * Once created, you can connect the wallet to your app by calling the `connect` method.
 *
 * The `connect` method returns a promise that resolves to the connected account.
 *
 * Each wallet type can have different connect options. [View the different connect options](https://portal.thirdweb.com/references/typescript/v5/WalletConnectionOption)
 *
 * ## Connecting to an injected wallet
 *
 * ```ts
 * import { createWallet } from "thirdweb/wallets";
 *
 * const metamaskWallet = createWallet("io.metamask");
 *
 * const account = await metamaskWallet.connect({
 *  client,
 * });
 * ```
 *
 * You can check if a wallet is installed by calling the [injectedProvider](https://portal.thirdweb.com/references/typescript/v5/injectedProvider) method.
 *
 * ## Connecting via WalletConnect modal
 *
 * ```ts
 * import { createWallet } from "thirdweb/wallets";
 *
 * const metamaskWallet = createWallet("io.metamask");
 *
 * await metamask.connect({
 *   client,
 *   walletConnect: {
 *     projectId: "YOUR_PROJECT_ID",
 *     showQrModal: true,
 *     appMetadata: {
 *       name: "My App",
 *       url: "https://my-app.com",
 *       description: "my app description",
 *       logoUrl: "https://path/to/my-app/logo.svg",
 *     },
 *   },
 * });
 * ```
 * [View ConnectWallet connection options](https://portal.thirdweb.com/references/typescript/v5/WCConnectOptions)
 *
 * ## Connecting with coinbase wallet
 *
 * ```ts
 * import { createWallet } from "thirdweb/wallets";
 *
 * const cbWallet = createWallet("com.coinbase.wallet", {
 *   appMetadata: {
 *     name: "My App",
 *     url: "https://my-app.com",
 *     description: "my app description",
 *     logoUrl: "https://path/to/my-app/logo.svg",
 *   },
 *   walletConfig: {
 *     // options: 'all' | 'smartWalletOnly' | 'eoaOnly'
 *     options: 'all',
 *   },
 * });
 *
 * const account = await cbWallet.connect({
 *  client,
 * });
 * ```
 *
 * [View Coinbase wallet creation options](https://portal.thirdweb.com/references/typescript/v5/CoinbaseWalletCreationOptions)
 *
 * ## Connecting with a smart wallet
 *
 * ```ts
 * import { createWallet } from "thirdweb/wallets";
 *
 * const wallet = createWallet("smart", {
 *   chain: sepolia,
 *   sponsorGas: true,
 * });
 *
 * const account = await wallet.connect({
 *  client,
 *  personalAccount, // pass the admin account
 * });
 * ```
 *
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
     * ECOSYSTEM WALLET
     */
    case isEcosystemWallet(id):
      return ecosystemWallet(
        ...(args as CreateWalletArgs<EcosystemWalletId>),
      ) as Wallet<ID>;

    /**
     * COINBASE WALLET VIA SDK
     * -> if no injected coinbase found, we'll use the coinbase SDK
     */
    case id === COINBASE: {
      const options = creationOptions as CreateWalletArgs<typeof COINBASE>[1];
      return coinbaseWalletSDK({
        createOptions: options,
        onConnectRequested: async (provider) => {
          // on the web, make sure to show the coinbase popup IMMEDIATELY on connection requested
          // otherwise the popup might get blocked in safari
          // TODO awaiting the provider is fast only thanks to preloading that happens in our components
          // these probably need to actually imported / created synchronously to be used headless properly
          const { showCoinbasePopup } = await import("./coinbase/utils.js");
          return showCoinbasePopup(provider);
        },
        providerFactory: () => getCoinbaseWebProvider(options),
      }) as Wallet<ID>;
    }
    /**
     * WALLET CONNECT AND INJECTED WALLETS + walletConnect standalone
     */
    default: {
      const emitter = createWalletEmitter<ID>();
      let account: Account | undefined;
      let chain: Chain | undefined;
      let unsubscribeChain: (() => void) | undefined;

      function reset() {
        account = undefined;
        chain = undefined;
      }

      let handleDisconnect = async () => {};

      const unsubscribeDisconnect = emitter.subscribe("disconnect", () => {
        reset();
        unsubscribeChain?.();
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
        autoConnect: async (
          options: WalletAutoConnectionOption<
            WCSupportedWalletIds | InjectedSupportedWalletIds
          >,
        ) => {
          const { injectedProvider } = await import("./injected/mipdStore.js");
          // injected wallet priority for autoConnect
          if (id !== "walletConnect" && injectedProvider(id)) {
            const { autoConnectEip1193Wallet } = await import(
              "./injected/index.js"
            );

            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await autoConnectEip1193Wallet({
              chain: options.chain,
              client: options.client,
              emitter,
              id: id as InjectedSupportedWalletIds,
              provider: getInjectedProvider(id),
            });
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            handleDisconnect = doDisconnect;
            handleSwitchChain = doSwitchChain;
            unsubscribeChain = emitter.subscribe("chainChanged", (newChain) => {
              chain = newChain;
            });
            trackConnect({
              chainId: chain.id,
              client: options.client,
              walletAddress: account.address,
              walletType: id,
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
              chainId: chain.id,
              client: options.client,
              walletAddress: account.address,
              walletType: id,
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
              chainId: chain.id,
              client: wcOptions.client,
              walletAddress: account.address,
              walletType: id,
            });
            return account;
          }

          if (id === "walletConnect") {
            const { client, chain: _chain, ...walletConnectOptions } = options;

            return wcConnect({
              chain: _chain,
              client,
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
            const { connectEip1193Wallet } = await import(
              "./injected/index.js"
            );

            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await connectEip1193Wallet({
              chain: options.chain,
              client: options.client,
              emitter,
              id: id as InjectedSupportedWalletIds,
              provider: getInjectedProvider(id),
            });
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            handleDisconnect = doDisconnect;
            handleSwitchChain = doSwitchChain;
            unsubscribeChain = emitter.subscribe("chainChanged", (newChain) => {
              chain = newChain;
            });
            trackConnect({
              chainId: chain.id,
              client: options.client,
              walletAddress: account.address,
              walletType: id,
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
        getAccount: () => account,
        getChain() {
          if (!chain) {
            return undefined;
          }

          chain = getCachedChainIfExists(chain.id) || chain;
          return chain;
        },
        getConfig: () => args[1],
        id,
        subscribe: emitter.subscribe,
        switchChain: async (c) => {
          try {
            await handleSwitchChain(c);
            chain = c;
          } catch (e) {
            console.error("Error switching chain", e);
          }
        },
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
