import type {
  WalletId,
  CreateWalletArgs,
  InjectedConnectOptions,
} from "./wallet-types.js";
import type { Account, Wallet } from "./interfaces/wallet.js";
import type { Chain } from "../chains/types.js";
import { injectedProvider } from "./injected/mipdStore.js";
import type {
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "./__generated__/wallet-ids.js";

import { createWalletEmitter } from "./wallet-emitter.js";
import { trackConnect } from "../analytics/track.js";
import type { WCConnectOptions } from "./wallet-connect/types.js";

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
     * EMBEDDED WALLET
     */
    case "embedded": {
      return embeddedWallet(
        creationOptions as CreateWalletArgs<"embedded">[1],
      ) as Wallet<ID>;
    }

    /**
     * COINBASE WALLET VIA SDK
     * -> if no injected coinbase found, we'll use the coinbase SDK
     */
    case "com.coinbase.wallet": {
      return coinbaseWalletSDK() as Wallet<ID>;
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

      const reset = () => {
        account = undefined;
        chain = undefined;
      };

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
        autoConnect: async (options) => {
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
  const emitter = createWalletEmitter<"embedded">();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;

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
    disconnect: async () => {
      account = undefined;
      chain = undefined;
      emitter.emit("disconnect", undefined);
      const { disconnectSmartWallet } = await import("./smart/index.js");
      await disconnectSmartWallet(_smartWallet);
    },
    switchChain: async () => {
      throw new Error("Not implemented yet");
    },
  };

  return _smartWallet;
}

/**
 * Creates an embedded wallet.
 * @param createOptions - configuration options
 * @returns The created embedded wallet.
 * @example
 * ```ts
 * import { embeddedWallet } from "thirdweb/wallets";
 *
 * const wallet = embeddedWallet();
 *
 * const account = await wallet.connect({
 *   client,
 *   chain,
 *   strategy: "google",
 * });
 * ```
 * @wallet
 */
export function embeddedWallet(
  createOptions?: CreateWalletArgs<"embedded">[1],
): Wallet<"embedded"> {
  const emitter = createWalletEmitter<"embedded">();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  return {
    id: "embedded",
    subscribe: emitter.subscribe,
    getChain: () => chain,
    getConfig: () => createOptions,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { autoConnectEmbeddedWallet } = await import(
        "./embedded/core/wallet/index.js"
      );

      const [connectedAccount, connectedChain] =
        await autoConnectEmbeddedWallet(options);
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: "embedded",
        walletAddress: account.address,
      });
      // return only the account
      return account;
    },
    connect: async (options) => {
      const { connectEmbeddedWallet } = await import(
        "./embedded/core/wallet/index.js"
      );

      const [connectedAccount, connectedChain] =
        await connectEmbeddedWallet(options);
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      trackConnect({
        client: options.client,
        walletType: "embedded",
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
      // simply set the new chain
      chain = newChain;
      emitter.emit("chainChanged", newChain);
    },
  };
}

/**
 * internal helper functions
 */

function coinbaseWalletSDK(): Wallet<"com.coinbase.wallet"> {
  const emitter = createWalletEmitter<"com.coinbase.wallet">();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;

  const reset = () => {
    account = undefined;
    chain = undefined;
  };

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
    id: "com.coinbase.wallet",
    subscribe: emitter.subscribe,
    getChain: () => chain,
    getConfig: () => undefined,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { autoConnectCoinbaseWalletSDK } = await import(
        "./coinbase/coinbaseSDKWallet.js"
      );
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await autoConnectCoinbaseWalletSDK(options, emitter);
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      trackConnect({
        client: options.client,
        walletType: "com.coinbase.wallet",
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
        await connectCoinbaseWalletSDK(options, emitter);

      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      trackConnect({
        client: options.client,
        walletType: "com.coinbase.wallet",
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
