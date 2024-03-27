import type {
  WalletId,
  CreateWalletArgs,
  InjectedConnectOptions,
} from "./wallet-types.js";
import type { Account, Wallet } from "./interfaces/wallet.js";
import type { Chain } from "../chains/types.js";
import { injectedProvider } from "./injected/mipdStore.js";
import { normalizeChainId } from "./utils/normalizeChainId.js";
import { defineChain } from "../chains/utils.js";
import type { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import type {
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "./__generated__/wallet-ids.js";
import type { WCAutoConnectOptions } from "./wallet-connect/types.js";

// TODO: figure out how to define the type without tuple args type and using function overloads

/**
 * @internal
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
     * EMBEDDED WALLET
     */
    case id === "embedded": {
      return embeddedWallet() as Wallet<ID>;
    }

    /**
     * COINBASE WALLET VIA SDK
     * -> if no injected coinbase found, we'll use the coinbase SDK
     */
    case id === "com.coinbase.wallet" &&
      !injectedProvider("com.coinbase.wallet"): {
      return coinbaseWalletSDK() as Wallet<ID>;
    }

    /**
     * WALLET CONNECT AND INJECTED WALLETS
     */
    default: {
      let account: Account | undefined = undefined;
      let chain: Chain | undefined = undefined;

      let switchChain: (chain: Chain) => Promise<void> = async () => {
        throw new Error("Not implemented yet");
      };
      let disconnect: () => Promise<void> = async () => {
        account = undefined;
        chain = undefined;
      };
      const wallet: Wallet<ID> = {
        id,
        getChain: () => chain,
        getAccount: () => account,
        autoConnect: async (options) => {
          // injeted wallet priority for autoconnect
          if (injectedProvider(id)) {
            const { autoConnectInjectedWallet, switchChainInjectedWallet } =
              await import("./injected/index.js");
            switchChain = (newChain) =>
              switchChainInjectedWallet(
                wallet as Wallet<InjectedSupportedWalletIds>,
                newChain,
              ).then(() => {
                chain = newChain;
              });
            const [connectedAccount, connectedChain] =
              await autoConnectInjectedWallet(
                wallet as Wallet<InjectedSupportedWalletIds>,
              );
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            // return account
            return account;
          }

          if (options && "walletConnect" in options) {
            const { autoConnectWC, switchChainWC, disconnectWC } = await import(
              "./wallet-connect/index.js"
            );
            switchChain = (newChain) =>
              switchChainWC(
                wallet as Wallet<WCSupportedWalletIds>,
                newChain,
              ).then(() => {
                chain = newChain;
              });
            disconnect = () =>
              disconnectWC(wallet as Wallet<WCSupportedWalletIds>);

            const [connectedAccount, connectedChain] = await autoConnectWC(
              wallet as Wallet<WCSupportedWalletIds>,
              options as WCAutoConnectOptions,
            );
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            // return account
            return account;
          }
          throw new Error("Failed to auto connect");
        },
        connect: async (options) => {
          // prefer walletconnect over injected for connect (more explicit)
          if (options && "walletConnect" in options) {
            const { connectWC, switchChainWC, disconnectWC } = await import(
              "./wallet-connect/index.js"
            );
            switchChain = (newChain) =>
              switchChainWC(
                wallet as Wallet<WCSupportedWalletIds>,
                newChain,
              ).then(() => {
                chain = newChain;
              });
            disconnect = () =>
              disconnectWC(wallet as Wallet<WCSupportedWalletIds>);

            const [connectedAccount, connectedChain] = await connectWC(
              wallet as Wallet<WCSupportedWalletIds>,
              options,
            );
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            // return account
            return account;
          }
          if (injectedProvider(id)) {
            const { connectInjectedWallet, switchChainInjectedWallet } =
              await import("./injected/index.js");
            switchChain = (newChain) =>
              switchChainInjectedWallet(
                wallet as Wallet<InjectedSupportedWalletIds>,
                newChain,
              ).then(() => {
                chain = newChain;
              });

            const [connectedAccount, connectedChain] =
              await connectInjectedWallet(
                wallet as Wallet<InjectedSupportedWalletIds>,
                options as InjectedConnectOptions,
              );
            // set the states
            account = connectedAccount;
            chain = connectedChain;
            // return account
            return account;
          }
          throw new Error("Failed to connect");
        },
        // these get overridden in connect and autoconnect
        disconnect: () => disconnect(),
        switchChain: (c) => switchChain(c),
      };
      return wallet;
    }
  }
}

/**
 * Creates a smart wallet.
 * @param createOptions - The options for creating the wallet.
 * @returns The created smart wallet.
 * @example
 * ```ts
 * import { smartWallet } from "thirdweb/wallets";
 * ```
 */
export function smartWallet(
  createOptions: CreateWalletArgs<"smart">[1],
): Wallet<"smart"> {
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;

  const _smartWallet: Wallet<"smart"> = {
    id: "smart",
    getChain: () => chain,
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
      // return account
      return account;
    },
    disconnect: async () => {
      const { disconnectSmartWallet } = await import("./smart/index.js");
      await disconnectSmartWallet(_smartWallet);
      account = undefined;
      chain = undefined;
    },
    switchChain: async () => {
      throw new Error("Not implemented yet");
    },
  };

  return _smartWallet;
}

/**
 * Creates an embedded wallet.
 * @returns The created embedded wallet.
 * @example
 * ```ts
 * import { embeddedWallet } from "thirdweb/wallets";
 * ```
 */
export function embeddedWallet(): Wallet<"embedded"> {
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  return {
    id: "embedded",
    getChain: () => chain,
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
      // return only the account
      return account;
    },
    disconnect: async () => {
      // simply un-set the states
      account = undefined;
      chain = undefined;
    },
    switchChain: async (newChain) => {
      // simply set the new chain
      chain = newChain;
    },
  };
}

/**
 * internal helper functions
 */

function coinbaseWalletSDK(): Wallet<"com.coinbase.wallet"> {
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;
  function onChainChanged(newChainId: string) {
    // set the new chain
    chain = defineChain(normalizeChainId(newChainId));
  }
  function onAccountsChanged(
    provider: CoinbaseWalletProvider,
    accounts: string[],
  ) {
    if (accounts.length === 0) {
      onDisconnect(provider);
    }
  }
  function onDisconnect(provider: CoinbaseWalletProvider) {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    // un-set the states
    account = undefined;
    chain = undefined;
  }

  const coinbaseSDKWallet: Wallet<"com.coinbase.wallet"> = {
    id: "com.coinbase.wallet",
    getChain: () => chain,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { autoConnectCoinbaseWalletSDK } = await import(
        "./coinbase/coinbaseSDKWallet.js"
      );
      const [connectedAccount, connectedChain] =
        await autoConnectCoinbaseWalletSDK(coinbaseSDKWallet, options, {
          onAccountsChanged,
          onChainChanged,
          onDisconnect,
        });
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      // return account
      return account;
    },
    connect: async (options) => {
      const { connectCoinbaseWalletSDK } = await import(
        "./coinbase/coinbaseSDKWallet.js"
      );
      const [connectedAccount, connectedChain] = await connectCoinbaseWalletSDK(
        coinbaseSDKWallet,
        options,
        {
          onAccountsChanged,
          onChainChanged,
          onDisconnect,
        },
      );

      // set the states
      account = connectedAccount;
      chain = connectedChain;
      // return account
      return account;
    },
    disconnect: async () => {
      const { disconnectCoinbaseWalletSDK } = await import(
        "./coinbase/coinbaseSDKWallet.js"
      );
      await disconnectCoinbaseWalletSDK(coinbaseSDKWallet, onDisconnect);
    },
    switchChain: async (newChain) => {
      const { switchChainCoinbaseWalletSDK } = await import(
        "./coinbase/coinbaseSDKWallet.js"
      );
      await switchChainCoinbaseWalletSDK(coinbaseSDKWallet, newChain);
    },
  };

  return coinbaseSDKWallet;
}
