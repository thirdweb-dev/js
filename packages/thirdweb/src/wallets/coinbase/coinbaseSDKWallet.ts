import type { Account, Wallet } from "../interfaces/wallet.js";
import type { WalletMetadata } from "../types.js";
import type { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
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
import { coinbaseMetadata } from "./coinbaseMetadata.js";
import {
  getSavedConnectParamsFromStorage,
  saveConnectParamsToStorage,
} from "../manager/storage.js";
import { defineChain, getChainDataForChain } from "../../chains/utils.js";
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
  onUri?: (uri: string | null) => void;
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
};

/**
 * Connect to Coinbase wallet using the Coinbase SDK which allows connecting to Coinbase Wallet extension and Coinbase Wallet Mobile app by scanning a QR code.
 * @param options - Options for connecting to the Coinbase Wallet SDK.
 * Refer to [CoinbaseSDKWalletOptions](https://portal.thirdweb.com/references/typescript/v5/CoinbaseSDKWalletOptions)
 * @example
 * ```ts
 * const wallet = coinbaseSDKWallet({
 *  appName: "My awesome app"
 * })
 * ```
 * @returns A `CoinbaseSDKWallet` instance.
 */
export function coinbaseSDKWallet(options: CoinbaseSDKWalletOptions) {
  return new CoinbaseSDKWallet(options);
}

/**
 * Connect to Coinbase wallet using the Coinbase SDK which allows connecting to Coinbase Wallet extension or mobile app.
 */
export class CoinbaseSDKWallet implements Wallet {
  private options: CoinbaseSDKWalletOptions;
  private provider: CoinbaseWalletProvider | undefined;
  private chain: Chain | undefined;
  private account?: Account | undefined;
  metadata: WalletMetadata;

  /**
   * Create instance of `CoinbaseSDKWallet`
   * @param options - Options for creating the `CoinbaseSDKWallet` instance.
   * Refer to [CoinbaseSDKWalletOptions](https://portal.thirdweb.com/references/typescript/v5/CoinbaseSDKWalletOptions) for details.
   * @example
   * ```ts
   * const wallet = new CoinbaseSDKWallet({
   *  appName: "My App",
   *  appLogoUrl: "https://path/to/app/logo.png"
   * })
   * ```
   * @returns A `CoinbaseSDKWallet` instance.
   */
  constructor(options: CoinbaseSDKWalletOptions) {
    this.options = options;
    this.metadata = coinbaseMetadata;
  }

  /**
   * Get the `Chain` object of the blockchain that the wallet is connected to.
   * @returns The `Chain` object
   * @example
   * ```ts
   * const chain = wallet.getChain();
   * ```
   */
  getChain(): Chain | undefined {
    return this.chain;
  }

  /**
   * Get the connected `Account`
   * @returns The connected `Account` object
   * @example
   * ```ts
   * const account = wallet.getAccount();
   * ```
   */
  getAccount(): Account | undefined {
    return this.account;
  }

  /**
   * Connect to the Coinbase Wallet extension or mobile app
   * @param options - The options for connecting the wallet.
   * Refer to [CoinbaseSDKWalletConnectionOptions](https://portal.thirdweb.com/references/typescript/v5/CoinbaseSDKWalletConnectionOptions) for details.
   * @example
   * Connect to the Coinbase Wallet Provider with no options.
   * ```ts
   * // no options
   * const address = await wallet.connect()
   * ```
   *
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
   * ```
   *
   * If the Coinbase Extension is not installed - By default, the Coinbase Wallet SDK will open the Coinbase Wallet "Onboarding Overlay" popup to prompt the user to connect to the Coinbase Wallet mobile app by scanning a QR code.
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
   * @returns A Promise that resolves to connected `Account` object
   */
  async connect(options?: CoinbaseSDKWalletConnectionOptions) {
    const provider = await this.initProvider({
      ...options,
    });

    provider.on("accountsChanged", this.onAccountsChanged);
    provider.on("chainChanged", this.onChainChanged);
    provider.on("disconnect", this.onDisconnect);

    const accounts = (await provider.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (!accounts[0]) {
      throw new Error("No accounts found");
    }

    const address = getAddress(accounts[0]);

    const connectedChainId = (await provider.request({
      method: "eth_chainId",
    })) as string | number;

    const chainId = normalizeChainId(connectedChainId);
    this.chain = defineChain(chainId);

    // Switch to chain if provided
    if (
      connectedChainId &&
      options?.chain &&
      connectedChainId !== options?.chain.id
    ) {
      await this.switchChain(options.chain);
      this.chain = options.chain;
    }

    if (options?.chain) {
      const saveParams: SavedConnectParams = {
        chain: options?.chain,
      };

      saveConnectParamsToStorage(this.metadata.id, saveParams);
    }

    return this.onConnect(address);
  }

  /**
   * @internal
   */
  private onConnect(address: string) {
    const wallet = this;

    const account: Account = {
      address,
      async sendTransaction(tx: SendTransactionOption) {
        if (!wallet.chain || !wallet.provider || !account.address) {
          throw new Error("Provider not setup");
        }

        const transactionHash = (await wallet.provider.request({
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
        if (!wallet.provider || !account.address) {
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

        return await wallet.provider.request({
          method: "personal_sign",
          params: [messageToSign, account.address],
        });
      },
      async signTypedData(typedData) {
        if (!wallet.provider || !account.address) {
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

        return await wallet.provider.request({
          method: "eth_signTypedData_v4",
          params: [account.address, stringifiedData],
        });
      },
    };

    this.account = account;
    return account;
  }

  /**
   * Auto connect to the Coinbase wallet. This only succeeds if the Coinbase wallet provider is still connected.
   *
   * Auto connect is useful to avoid asking the user to connect to the wallet provider again on page refresh or revisit.
   * @example
   * ```ts
   * const account = await wallet.autoConnect();
   * ```
   * @returns A Promise that resolves to the connected `Account`
   */
  async autoConnect() {
    const savedParams: SavedConnectParams | null =
      await getSavedConnectParamsFromStorage(this.metadata.id);

    const provider = await this.initProvider({
      chain: savedParams?.chain,
    });

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
    this.chain = defineChain(chainId);

    return this.onConnect(address);
  }

  /**
   * Switch the wallet to a different blockchain by passing the `Chain` object of it.
   * If the wallet already has the capability to connect to the blockchain, it will switch to it. If not, Wallet will prompt the user to confirm adding a new blockchain to the wallet.
   * This action may require the user to confirm the switch chain request or add a new blockchain request.
   *
   * This method throws an error if the wallet fails to do the above or user denies the switch chain request or denies adding a new blockchain request.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain.
   * @param chain - The `Chain` object of the blockchain
   * @example
   * ```ts
   * import { defineChain } from "thirdweb";
   * const mumbai = defineChain({
   *  id: 80001,
   * });
   *
   * await wallet.switchChain(mumbai)
   * ```
   */
  async switchChain(chain: Chain) {
    const provider = this.provider;

    if (!provider) {
      throw new Error("Provider not initialized");
    }

    const chainIdHex = numberToHex(chain.id);

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      const apiChain = await getChainDataForChain(chain);

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
  private async initProvider(options: CoinbaseSDKWalletConnectionOptions) {
    const { CoinbaseWalletSDK } = await import("@coinbase/wallet-sdk");
    const client = new CoinbaseWalletSDK({
      ...options,
      appName: this.options.appName,
    });

    if (options.onUri) {
      options.onUri(client.getQrUrl());
    }

    const chain = options?.chain || ethereum;

    this.provider = client.makeWeb3Provider(chain.rpc, chain.id);
    return this.provider;
  }

  /**
   * NOTE: must be a arrow function
   * @internal
   */
  private onChainChanged = (newChain: number | string) => {
    const chainId = normalizeChainId(newChain);
    this.chain = defineChain(chainId);
  };

  /**
   * NOTE: must be a arrow function
   * @internal
   */
  private onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.onDisconnect();
    } else {
      // TODO: change account
    }
  };

  /**
   * NOTE: must be a arrow function
   * @internal
   */
  private onDisconnect = () => {
    const provider = this.provider;
    if (provider) {
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect);
    }

    this.account = undefined;
    this.chain = undefined;
  };

  /**
   * Disconnect from the Coinbase Wallet
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect() {
    if (this.provider) {
      this.provider.disconnect();
      this.provider.close();
    }
    this.onDisconnect();
  }
}
