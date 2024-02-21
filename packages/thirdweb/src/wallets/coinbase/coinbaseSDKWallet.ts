import type { Account, Wallet } from "../interfaces/wallet.js";
import type { WalletMetadata } from "../types.js";
import type { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import type { CoinbaseWalletSDK as CoinbaseWalletSDKConstructor } from "@coinbase/wallet-sdk";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import {
  getAddress,
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

type SavedConnectParams = {
  chain?: Chain;
};

type CoinbaseWalletSDKOptions = Readonly<
  ConstructorParameters<typeof CoinbaseWalletSDKConstructor>[0]
>;

export type CoinbaseSDKWalletConnectionOptions = Omit<
  CoinbaseWalletSDKOptions,
  "appName"
> & {
  chain?: Chain;
  onUri?: (uri: string | null) => void;
};

export type CoinbaseSDKWalletOptions = {
  appName: string;
};

/**
 * Connect to Coinbase wallet using the Coinbase SDK which allows connecting to Coinbase Wallet extension or mobile app.
 * @param options - The options for connecting to the Coinbase Wallet SDK.
 * @example
 * ```ts
 * const wallet = coinbaseSDKWallet()
 * ```
 * @returns A `CoinbaseSDKWallet` instance.
 */
export function coinbaseSDKWallet(options: CoinbaseWalletSDKOptions) {
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
   * Create a new CoinbaseSDKWallet instance
   * @param options - Options for connecting to the Coinbase Wallet SDK.
   * @example
   * ```ts
   * const wallet = new CoinbaseSDKWallet({
   *  appName: "My App"
   * })
   * ```
   * @returns A `CoinbaseSDKWallet` instance.
   */
  constructor(options: CoinbaseSDKWalletOptions) {
    this.options = options;
    this.metadata = coinbaseMetadata;
  }

  /**
   * Get the `chain` that the wallet is connected to.
   * @returns The chain
   * @example
   * ```ts
   * const chain = wallet.getChain();
   * ```
   */
  getChain(): Chain | undefined {
    return this.chain;
  }

  /**
   * Get the connected `Account` from the wallet.
   * @returns The connected account
   * @example
   * ```ts
   * const account = wallet.getAccount();
   * ```
   */
  getAccount(): Account | undefined {
    return this.account;
  }

  /**
   * Connect to the Coinbase Wallet
   * @param options - The options for connecting to the Injected Wallet Provider.
   * @example
   * ```ts
   * const account = await wallet.connect()
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
    // TODO check what's type of connectedChainId

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
   * Auto connect to saved Coinbase Wallet session
   * @example
   * ```ts
   * await wallet.autoConnect();
   * ```
   * @returns A Promise that resolves to the connected `Account` object
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
   * Switch chain in connected wallet
   * @param chain - The chain to switch to
   * @example
   * ```ts
   * await wallet.switchChain(ethereum)
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

  private onChainChanged = (newChain: number | string) => {
    const chainId = normalizeChainId(newChain);
    this.chain = defineChain(chainId);
  };

  private onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.onDisconnect();
    } else {
      // TODO: change account
    }
  };

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
   * Disconnect from the Coinbase Wallet and clear the session
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
