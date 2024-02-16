import type { Account, Wallet } from "../interfaces/wallet.js";
import type { WalletMetadata } from "../types.js";
import type { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import type { CoinbaseWalletSDK as CoinbaseWalletSDKConstructor } from "@coinbase/wallet-sdk";
import { getChainDataForChainId } from "../../chain/index.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import {
  getAddress,
  toHex,
  type Hex,
  stringToHex,
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  validateTypedData,
  isHex,
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

type SavedConnectParams = {
  chainId?: number;
};

type CoinbaseWalletSDKOptions = Readonly<
  ConstructorParameters<typeof CoinbaseWalletSDKConstructor>[0]
>;

export type CoinbaseSDKWalletConnectionOptions = Omit<
  CoinbaseWalletSDKOptions,
  "appName"
> & {
  chainId?: number;
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
  private chainId: number | undefined;
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
   * Get the `chainId` that the wallet is connected to.
   * @returns The chainId
   * @example
   * ```ts
   * const chainId = wallet.getChainId();
   * ```
   */
  getChainId(): number | undefined {
    return this.chainId;
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

    this.chainId = normalizeChainId(connectedChainId);

    // Switch to chain if provided
    if (
      connectedChainId &&
      options?.chainId &&
      Number(connectedChainId) !== options?.chainId
    ) {
      await this.switchChain(options.chainId);
      this.chainId = options.chainId;
    }

    if (options?.chainId) {
      const saveParams: SavedConnectParams = {
        chainId: options?.chainId,
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
        if (!wallet.chainId || !wallet.provider || !account.address) {
          throw new Error("Provider not setup");
        }

        if (normalizeChainId(tx.chainId) !== wallet.chainId) {
          await wallet.switchChain(tx.chainId);
        }

        const transactionHash = (await wallet.provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              accessList: tx.accessList,
              value: tx.value ? toHex(tx.value) : undefined,
              gas: tx.gas ? toHex(tx.gas) : undefined,
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
            return toHex(message.raw);
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
      chainId: savedParams?.chainId,
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
    this.chainId = normalizeChainId(connectedChainId);

    return this.onConnect(address);
  }

  /**
   * Switch chain in connected wallet
   * @param chainId - The chainId to switch to
   * @example
   * ```ts
   * await wallet.switchChain(1)
   * ```
   */
  async switchChain(chainId: number) {
    const provider = this.provider;

    if (!provider) {
      throw new Error("Provider not initialized");
    }

    const chainIdHex = toHex(chainId);

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      const chain = await getChainDataForChainId(chainId);

      // Indicates chain is not added to provider
      if ((error as any).code === 4902) {
        // try to add the chain
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainIdHex,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: getValidPublicRPCUrl(chain), // no client id on purpose here
              blockExplorerUrls: chain.explorers?.map((x) => x.url) || [],
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

    const chainId = options?.chainId || 1;

    const chain = await getChainDataForChainId(chainId);
    const jsonRpcUrl = chain?.rpc[0];
    this.provider = client.makeWeb3Provider(jsonRpcUrl, chainId);
    return this.provider;
  }

  private onChainChanged = (chainId: number | string) => {
    this.chainId = normalizeChainId(chainId);
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
    this.chainId = undefined;
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
