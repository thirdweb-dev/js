import type { Chain } from "../chains/types.js";
import type {
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "./__generated__/wallet-ids.js";
import { injectedProvider } from "./injected/mipdStore.js";
import type { Account, Wallet } from "./interfaces/wallet.js";
import type {
  CreateWalletArgs,
  InjectedConnectOptions,
  WalletAutoConnectionOption,
  WalletConnectionOption,
  WalletId,
} from "./wallet-types.js";

import { trackConnect } from "../analytics/track.js";
import type { ThirdwebClient } from "../client/client.js";
import { getContract } from "../contract/contract.js";
import { isContractDeployed } from "../utils/bytecode/is-contract-deployed.js";
import { COINBASE } from "./constants.js";
import { DEFAULT_ACCOUNT_FACTORY } from "./smart/lib/constants.js";
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

  switch (id) {
    /**
     * SMART WALLET
     */
    case "smart": {
      return smartWallet(
        creationOptions as CreateWalletArgs<"smart">[1],
      ) as Wallet<ID>;
    }
    /**
     * IN-APP WALLET
     */
    case "embedded":
    case "inApp": {
      return inAppWallet(
        creationOptions as CreateWalletArgs<"inApp">[1],
      ) as Wallet<ID>;
    }

    /**
     * COINBASE WALLET VIA SDK
     * -> if no injected coinbase found, we'll use the coinbase SDK
     */
    case COINBASE: {
      return coinbaseWalletSDK(
        creationOptions as CreateWalletArgs<typeof COINBASE>[1],
      ) as Wallet<ID>;
    }

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
            const { autoConnectWC } = await import("./wallet-connect/index.js");

            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await autoConnectWC(
              options,
              emitter,
              wallet.id as WCSupportedWalletIds,
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
            const { connectWC } = await import("./wallet-connect/index.js");

            const [
              connectedAccount,
              connectedChain,
              doDisconnect,
              doSwitchChain,
            ] = await connectWC(
              wcOptions,
              emitter,
              wallet.id as WCSupportedWalletIds | "walletConnect",
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

          // prefer walletconnect over injected for connect (more explicit)
          if (options && "walletConnect" in options) {
            return wcConnect(options);
          }

          if (injectedProvider(id)) {
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

/**
 * Creates a smart wallet.
 * @param createOptions - The options for creating the wallet.
 * @returns The created smart wallet.
 * @example
 * ```ts
 * import { smartWallet } from "thirdweb/wallets";
 *
 * const wallet = smartWallet({
 *  factoryAddress: "0x1234...",
 *  chain: sepolia,
 *  gasless: true,
 * });
 *
 * const account = await wallet.connect({
 *   client,
 *   personalAccount: account,
 * });
 * ```
 * @wallet
 */
export function smartWallet(
  createOptions: CreateWalletArgs<"smart">[1],
): Wallet<"smart"> {
  const emitter = createWalletEmitter<"smart">();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  let lastConnectOptions: WalletConnectionOption<"smart"> | undefined;

  const _smartWallet: Wallet<"smart"> = {
    id: "smart",
    subscribe: emitter.subscribe,
    getChain: () => chain,
    getConfig: () => createOptions,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { connectSmartWallet } = await import("./smart/index.js");
      const [connectedAccount, connectedChain] = await connectSmartWallet(
        _smartWallet,
        options,
        createOptions,
      );
      // set the states
      lastConnectOptions = options;
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: "smart",
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    connect: async (options) => {
      const { connectSmartWallet } = await import("./smart/index.js");
      const [connectedAccount, connectedChain] = await connectSmartWallet(
        _smartWallet,
        options,
        createOptions,
      );
      // set the states
      lastConnectOptions = options;
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: "smart",
        walletAddress: account.address,
      });
      // return account
      emitter.emit("accountChanged", account);
      return account;
    },
    disconnect: async () => {
      account = undefined;
      chain = undefined;
      const { disconnectSmartWallet } = await import("./smart/index.js");
      await disconnectSmartWallet(_smartWallet);
      emitter.emit("disconnect", undefined);
    },
    switchChain: async (newChain: Chain) => {
      if (!lastConnectOptions) {
        throw new Error("Cannot switch chain without a previous connection");
      }
      // check if factory is deployed
      const factory = getContract({
        address: createOptions.factoryAddress || DEFAULT_ACCOUNT_FACTORY,
        chain: newChain,
        client: lastConnectOptions.client,
      });
      const isDeployed = await isContractDeployed(factory);
      if (!isDeployed) {
        throw new Error(
          `Factory contract not deployed on chain: ${newChain.id}`,
        );
      }
      const { connectSmartWallet } = await import("./smart/index.js");
      const [connectedAccount, connectedChain] = await connectSmartWallet(
        _smartWallet,
        { ...lastConnectOptions, chain: newChain },
        createOptions,
      );
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      emitter.emit("chainChanged", newChain);
    },
  };

  return _smartWallet;
}

/**
 * Creates an in-app wallet.
 * @param createOptions - configuration options
 * @returns The created in-app wallet.
 * @example
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 *
 * const wallet = inAppWallet();
 *
 * const account = await wallet.connect({
 *   client,
 *   chain,
 *   strategy: "google",
 * });
 * ```
 * Enable smart accounts and sponsor gas for you users:
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  smartAccount: {
 *   chain: sepolia,
 *   sponsorGas: true,
 * },
 * });
 * ```
 *
 * Specify a logo for your login page
 * ```ts
 * import { inAppWallet } from "thirdweb/wallets";
 * const wallet = inAppWallet({
 *  metadata: {
 *   image: {
 *    src: "https://example.com/logo.png",
 *    alt: "My logo",
 *    width: 100,
 *    height: 100,
 *   },
 *  },
 * });
 * ```
 * @wallet
 */
export function inAppWallet(
  createOptions?: CreateWalletArgs<"inApp">[1],
): Wallet<"inApp"> {
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
      const { autoConnectInAppWallet } = await import(
        "./in-app/core/wallet/index.js"
      );

      const [connectedAccount, connectedChain] = await autoConnectInAppWallet(
        options,
        createOptions,
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
      const { connectInAppWallet } = await import(
        "./in-app/core/wallet/index.js"
      );

      const [connectedAccount, connectedChain] = await connectInAppWallet(
        options,
        createOptions,
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
      // simply un-set the states
      account = undefined;
      chain = undefined;
      emitter.emit("disconnect", undefined);
    },
    switchChain: async (newChain) => {
      if (createOptions?.smartAccount && client && account) {
        // if account abstraction is enabled, reconnect to smart account on the new chain
        const { autoConnectInAppWallet } = await import(
          "./in-app/core/wallet/index.js"
        );
        const [connectedAccount, connectedChain] = await autoConnectInAppWallet(
          {
            chain: newChain,
            client,
          },
          createOptions,
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

/**
 * internal helper functions
 */

function coinbaseWalletSDK(
  createOptions?: CreateWalletArgs<typeof COINBASE>[1],
): Wallet<typeof COINBASE> {
  const emitter = createWalletEmitter<typeof COINBASE>();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;

  function reset() {
    account = undefined;
    chain = undefined;
  }

  let handleDisconnect = async () => {};

  let handleSwitchChain = async (newChain: Chain) => {
    chain = newChain;
  };

  const unsubscribeChainChanged = emitter.subscribe(
    "chainChanged",
    (newChain) => {
      chain = newChain;
    },
  );

  const unsubscribeDisconnect = emitter.subscribe("disconnect", () => {
    reset();
    unsubscribeChainChanged();
    unsubscribeDisconnect();
  });

  emitter.subscribe("accountChanged", (_account) => {
    account = _account;
  });

  return {
    id: COINBASE,
    subscribe: emitter.subscribe,
    getChain: () => chain,
    getConfig: () => createOptions,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { autoConnectCoinbaseWalletSDK } = await import(
        "./coinbase/coinbaseSDKWallet.js"
      );
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await autoConnectCoinbaseWalletSDK(options, createOptions, emitter);
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      trackConnect({
        client: options.client,
        walletType: COINBASE,
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    connect: async (options) => {
      const { connectCoinbaseWalletSDK } = await import(
        "./coinbase/coinbaseSDKWallet.js"
      );
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await connectCoinbaseWalletSDK(options, createOptions, emitter);

      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      trackConnect({
        client: options.client,
        walletType: COINBASE,
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    disconnect: async () => {
      reset();
      await handleDisconnect();
    },
    switchChain: async (newChain) => {
      await handleSwitchChain(newChain);
    },
  };
}
