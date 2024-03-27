import type { Account, Wallet } from "../interfaces/wallet.js";
import type { AppMetadata } from "../types.js";
import {
  CoinbaseWalletSDK,
  type CoinbaseWalletProvider,
} from "@coinbase/wallet-sdk";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import {
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  validateTypedData,
} from "viem";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import type { SendTransactionOption } from "../interfaces/wallet.js";
import type { Address } from "abitype";
import { stringify } from "../../utils/json.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import { saveConnectParamsToStorage } from "../storage/walletStorage.js";
import { defineChain, getChainMetadata } from "../../chains/utils.js";
import type { Chain } from "../../chains/types.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import {
  isHex,
  numberToHex,
  type Hex,
  stringToHex,
  uint8ArrayToHex,
} from "../../utils/encoding/hex.js";
import { getAddress } from "../../utils/address.js";
import type { AsyncStorage } from "../storage/AsyncStorage.js";
import { getWalletData } from "../interfaces/wallet-data.js";

type SavedConnectParams = {
  chain?: Chain;
};

/**
 * Options for connecting to the CoinbaseSDK Wallet
 */
export type CoinbaseSDKWalletConnectionOptions = {
  /**
   * Whether to use Dark theme in the Coinbase Wallet "Onboarding Overlay" popup.
   *
   * This popup is opened when `headlessMode` is set to `true`.
   */
  darkMode?: boolean;

  /**
   * Whether to open Coinbase "Onboarding Overlay" popup or not when connecting to the wallet.
   * By default it is enabled if Coinbase Wallet extension is NOT installed and prompts the users to connect to the Coinbase Wallet mobile app by scanning a QR code
   *
   * If you want to render the QR code yourself, you should set this to `false` and use the `onUri` callback to get the QR code URI and render it in your app.
   * ```ts
   * const account = await wallet.connect({
   *  headlessMode: false,
   *  onUri: (uri) => {
   *    // render the QR code with `uri`
   *    // when user scans the QR code with Coinbase Wallet app, the promise will resolve with the connected account
   *  }
   * })
   * ```
   */
  headlessMode?: boolean;

  /**
   * Whether or not to reload dapp automatically after disconnect, defaults to `true`
   */
  reloadOnDisconnect?: boolean;

  /**
   * If you want the wallet to be connected to a specific blockchain, you can pass a `Chain` object to the `connect` method.
   * This will trigger a chain switch if the wallet provider is not already connected to the specified chain.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain.
   *
   * ```ts
   * import { defineChain } from "thirdweb";
   * const mumbai = defineChain({
   *  id: 80001,
   * });
   *
   * const address = await wallet.connect({ chain: mumbai })
   */
  chain?: Chain;

  /**
   * This is only relevant when the Coinbase Extension is not installed and you do not want to use the default Coinbase Wallet "Onboarding Overlay" popup.
   *
   * If you want to render the QR code yourself, you need to set `headlessMode` to `false` and use the `onUri` callback to get the QR code URI and render it in your app.
   * ```ts
   * const account = await wallet.connect({
   *  headlessMode: false,
   *  onUri: (uri) => {
   *    // render the QR code with `uri`
   *    // when user scans the QR code with Coinbase Wallet app, the promise will resolve with the connected account
   *  }
   * })
   * ```
   * Callback to be called with QR code URI
   * @param uri - The URI for rendering QR code
   */
  onUri?: (uri: string | undefined) => void;
  /**
   * Metadata of the dApp that will be passed to connected wallet.
   *
   * Some wallets may display this information to the user.
   *
   * Setting this property is highly recommended. If this is not set, Below default metadata will be used:
   *
   * ```ts
   * {
   *   name: "thirdweb powered dApp",
   *   url: "https://thirdweb.com",
   *   description: "thirdweb powered dApp",
   *   logoUrl: "https://thirdweb.com/favicon.ico",
   * };
   * ```
   */
  appMetadata?: AppMetadata;
};

export type CoinbaseSDKWalletOptions = {
  /**
   * Name of your application. This will be displayed in the Coinbase Wallet app/extension when connecting to your app.
   */
  appName: string;

  /**
   * URL to your application's logo. This will be displayed in the Coinbase Wallet app/extension when connecting to your app.
   */
  appLogoUrl?: string | null;

  /**
   * Storage interface of type [`AsyncStorage`](https://portal.thirdweb.com/references/typescript/v5/AsyncStorage) to save connected wallet data to the storage for auto-connect.
   * If not provided, no wallet data will be saved to the storage by thirdweb SDK
   */
  storage?: AsyncStorage;
};

const walletToProviderMap = new WeakMap<Wallet, CoinbaseWalletProvider>();

type CbCallbacks = {
  onAccountsChanged: (accounts: string[]) => void;
  onChainChanged: (newChainId: string) => void;
  onDisconnect: () => void;
};

const walletToEventCallbacks = new WeakMap<Wallet, CbCallbacks>();

function assertProvider(wallet: Wallet) {
  const provider = walletToProviderMap.get(wallet);
  if (!provider) {
    throw new Error("Provider not initialized");
  }
  return provider;
}

async function initProvider(
  wallet: Wallet<"com.coinbase.wallet">,
  options: CoinbaseSDKWalletConnectionOptions,
) {
  const client = new CoinbaseWalletSDK({
    ...options,
    // TODO: get a default name!
    appName: options.appMetadata?.name || "TODO",
  });

  if (options.onUri) {
    options.onUri(client.getQrUrl() || undefined);
  }

  const chain = options?.chain || ethereum;

  const provider = client.makeWeb3Provider(chain.rpc, chain.id);
  walletToProviderMap.set(wallet, provider);
  return provider;
}

function onDisconnect(wallet: Wallet<"com.coinbase.wallet">) {
  const provider = assertProvider(wallet);
  const callbacks = walletToEventCallbacks.get(wallet);
  if (provider && callbacks) {
    provider.removeListener("accountsChanged", callbacks.onAccountsChanged);
    provider.removeListener("chainChanged", callbacks.onChainChanged);
    provider.removeListener("disconnect", callbacks.onDisconnect);
    // remove the callbacks entry
    walletToEventCallbacks.delete(wallet);
  }
  const walletData = getWalletData(wallet);
  if (walletData) {
    walletData.account = undefined;
    walletData.chain = undefined;
  }
}

function onConnect(
  wallet: Wallet<"com.coinbase.wallet">,
  address: string,
): Account {
  const account: Account = {
    address,
    async sendTransaction(tx: SendTransactionOption) {
      const walletData = getWalletData(wallet);
      const provider = assertProvider(wallet);
      if (!walletData?.chain || !account.address) {
        throw new Error("Provider not setup");
      }

      const transactionHash = (await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            accessList: tx.accessList,
            value: tx.value ? numberToHex(tx.value) : undefined,
            gas: tx.gas ? numberToHex(tx.gas) : undefined,
            from: this.address,
            to: tx.to as Address,
            data: tx.data,
          },
        ],
      })) as Hex;

      return {
        transactionHash,
      };
    },
    async signMessage({ message }) {
      const provider = assertProvider(wallet);
      if (!account.address) {
        throw new Error("Provider not setup");
      }

      const messageToSign = (() => {
        if (typeof message === "string") {
          return stringToHex(message);
        }
        if (message.raw instanceof Uint8Array) {
          return uint8ArrayToHex(message.raw);
        }
        return message.raw;
      })();

      return await provider.request({
        method: "personal_sign",
        params: [messageToSign, account.address],
      });
    },
    async signTypedData(typedData) {
      const provider = assertProvider(wallet);
      if (!account.address) {
        throw new Error("Provider not setup");
      }
      const { domain, message, primaryType } =
        typedData as unknown as SignTypedDataParameters;

      const types = {
        EIP712Domain: getTypesForEIP712Domain({ domain }),
        ...typedData.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      validateTypedData({ domain, message, primaryType, types });

      const stringifiedData = stringify(
        { domain: domain ?? {}, message, primaryType, types },
        (_, value) => (isHex(value) ? value.toLowerCase() : value),
      );

      return await provider.request({
        method: "eth_signTypedData_v4",
        params: [account.address, stringifiedData],
      });
    },
  };

  const walletData = getWalletData(wallet);
  if (walletData) {
    walletData.account = account;
  }
  return account;
}

/**
 * @internal
 */
export async function connectCoinbaseWalletSDK(
  wallet: Wallet<"com.coinbase.wallet">,
  options: CoinbaseSDKWalletConnectionOptions,
) {
  const provider = await initProvider(wallet, options);
  const walletData = getWalletData(wallet);

  const callbacks: CbCallbacks = {
    onDisconnect: () => {
      onDisconnect(wallet);
    },
    onChainChanged: (newChain: number | string) => {
      const chainId = normalizeChainId(newChain);
      if (walletData) {
        walletData.chain = defineChain(chainId);
      }
    },
    onAccountsChanged: (accounts) => {
      if (accounts.length === 0) {
        onDisconnect(wallet);
      } else {
        // TODO: change account
      }
    },
  };

  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts[0]) {
    throw new Error("No accounts found");
  }

  provider.on("accountsChanged", callbacks.onAccountsChanged);
  provider.on("chainChanged", callbacks.onChainChanged);
  provider.on("disconnect", callbacks.onDisconnect);
  walletToEventCallbacks.set(wallet, callbacks);

  const address = getAddress(accounts[0]);

  const connectedChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | number;

  const chainId = normalizeChainId(connectedChainId);
  if (walletData) {
    walletData.chain = defineChain(chainId);
  }

  // Switch to chain if provided
  // if (
  //   connectedChainId &&
  //   options?.chain &&
  //   connectedChainId !== options?.chain.id
  // ) {
  //   await this.switchChain(options.chain);
  //   this.chain = options.chain;
  // }

  if (options?.chain && walletData?.storage) {
    const saveParams: SavedConnectParams = {
      chain: options?.chain,
    };

    saveConnectParamsToStorage(walletData?.storage, wallet.id, saveParams);
  }

  return onConnect(wallet, address);
}

/**
 * @internal
 */
export async function autoConnectCoinbaseWalletSDK(
  wallet: Wallet<"com.coinbase.wallet">,
  options: CoinbaseSDKWalletConnectionOptions,
) {
  const provider = await initProvider(wallet, options);

  // connected accounts
  const addresses = await (provider as Ethereum).request({
    method: "eth_accounts",
  });

  const address = addresses[0];

  if (!address) {
    throw new Error("No accounts found");
  }

  const connectedChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | number;
  const chainId = normalizeChainId(connectedChainId);
  const walletData = getWalletData(wallet);
  if (walletData) {
    walletData.chain = defineChain(chainId);
  }
  return onConnect(wallet, address);
}

/**
 * @internal
 */
export async function switchChainCoinbaseWalletSDK(
  wallet: Wallet<"com.coinbase.wallet">,
  chain: Chain,
) {
  const provider = assertProvider(wallet);

  const chainIdHex = numberToHex(chain.id);

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    const apiChain = await getChainMetadata(chain);

    // Indicates chain is not added to provider
    if ((error as any).code === 4902) {
      // try to add the chain
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: apiChain.name,
            nativeCurrency: apiChain.nativeCurrency,
            rpcUrls: getValidPublicRPCUrl(apiChain), // no client id on purpose here
            blockExplorerUrls: apiChain.explorers?.map((x) => x.url) || [],
          },
        ],
      });
    }
  }
}

/**
 * @internal
 */
export async function disconnectCoinbaseWalletSDK(
  wallet: Wallet<"com.coinbase.wallet">,
) {
  const provider = assertProvider(wallet);
  if (provider) {
    provider.disconnect();
    provider.close();
  }
  onDisconnect(wallet);
}
