import {
  getAddress,
  toHex,
  isHex,
  stringToHex,
  getTypesForEIP712Domain,
  validateTypedData,
  type Hex,
  type SignTypedDataParameters,
} from "viem";
import type { Address } from "abitype";
import type { Ethereum } from "../interfaces/ethereum.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type {
  InjectedWalletConnectOptions,
  InjectedWalletOptions,
} from "./types.js";
import { getMIPDStore, injectedProvider } from "./mipdStore.js";
import type {
  SendTransactionOption,
  Wallet,
  Account,
} from "../interfaces/wallet.js";
import { getChainDataForChainId } from "../../chain/index.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { stringify } from "../../utils/json.js";

/**
 * Connect to Injected Wallet Provider
 * @param options - The options for connecting to the Injected Wallet Provider.
 * @returns The Wallet instance.
 * @wallet
 * @throws Error if no injected provider is available or no accounts are available.
 * @example
 * ```ts
 * import { injectedWallet } from "thirdweb/wallets";
 *
 * // Using the Wallet Id
 * const wallet = await injectedWallet({
 *  walletId: "io.metamask",
 * });
 *
 * // Using custom logic to get the provider
 * const wallet = await injectedWallet({
 *  getProvider() {
 *   return window.xfi?.ethereum; // Example of XDEFI Wallet
 *  }
 * });
 *
 * // Using the default `window.ethereum` provider
 * const wallet = await injectedWallet();
 * ```
 */
export function injectedWallet(options?: InjectedWalletOptions) {
  return new InjectedWallet(options);
}

/**
 * Connect to an Injected Wallet Provider
 */
export class InjectedWallet implements Wallet {
  metadata: Wallet["metadata"];
  chainId: Wallet["chainId"];
  events: Wallet["events"];
  account?: Account | undefined;

  // NOTE: can't use `#` notation unless we want to use `tslib` (which we don't because it adds overhead)
  private options?: InjectedWalletOptions;
  private provider?: Ethereum;

  /**
   * Create a new Injected Wallet
   * @param options - The options for connecting to the Injected Wallet Provider.
   * @example
   * ```ts
   * // connect to `window.ethereum` provider
   * const wallet = new InjectedWallet();
   *
   * // connect to a specific wallet provider using EIP-6963 wallet id
   * const wallet = new InjectedWallet({
   *  walletId: "io.metamask",
   * })
   *
   * // connect to a specific wallet provider using custom logic
   * const wallet = new InjectedWallet({
   *  getProvider() {
   *    return window.xfi?.ethereum; // Example of XDEFI Wallet
   *  }
   * })
   * ```
   */
  constructor(options?: InjectedWalletOptions) {
    this.options = options;
    this.metadata = this.options?.metadata || {
      id: "injected",
      name: "injected",
      iconUrl: "TODO", // find a good default "injected wallet" icon
    };
  }

  /**
   * Auto connect to already connected wallet provider
   * @example
   * ```ts
   * await wallet.autoConnect();
   * ```
   * @returns A Promise that resolves to the connected address.
   */
  async autoConnect() {
    const provider = this.getProvider();
    this.provider = provider;

    // connected accounts
    const addresses = await provider.request({
      method: "eth_accounts",
    });

    return this.onConnect({
      provider,
      addresses,
      // do not force switch chain on autoConnect
      targetChainId: undefined,
    });
  }

  /**
   * Connect to the Injected Wallet Provider
   * @param options - The options for connecting to the Injected Wallet Provider.
   * @example
   * ```ts
   * // no options
   * const address = await wallet.connect()
   *
   * // connect and switch wallet to be on a specific blockchain with given chainId
   * const address = await wallet.connect({ chainId: 1 })
   * ```
   * @returns A Promise that resolves to the connected address.
   */
  async connect(options?: InjectedWalletConnectOptions) {
    const provider = this.getProvider();
    this.provider = provider;

    const addresses = await provider.request({
      method: "eth_requestAccounts",
    });

    return this.onConnect({
      provider,
      addresses,
      targetChainId: options?.chainId ? BigInt(options.chainId) : undefined,
    });
  }

  /**
   * Disconnect from the Injected Wallet Provider
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect() {
    this.onDisconnect();
  }

  /**
   * Switch the wallet provider to a different blockchain with the given chainId
   * @param chainId - The chainId of the blockchain to switch to.
   * @example
   * ```ts
   * await wallet.switchChain(1)
   * ```
   */
  async switchChain(chainId: bigint | number) {
    if (!this.provider) {
      throw new Error("no provider available");
    }

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(chainId) }],
      });
    } catch (e: any) {
      // if chain does not exist, add the chain
      if (e?.code === 4902 || e?.data?.originalError?.code === 4902) {
        const chain = await getChainDataForChainId(BigInt(chainId));
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: toHex(chainId),
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: getValidPublicRPCUrl(chain), // no client id on purpose here
              blockExplorerUrls: chain.explorers?.map((x) => x.url),
            },
          ],
        });
      } else {
        throw e;
      }
    }

    this.chainId = normalizeChainId(chainId);
  }

  /**
   * Call this method when the wallet provider is connected or auto connected
   * @internal
   */
  private async onConnect(data: {
    targetChainId?: bigint;
    provider: Ethereum;
    addresses: string[];
  }): Promise<Account> {
    const { addresses, provider, targetChainId } = data;
    const addr = addresses[0];
    if (!addr) {
      throw new Error("no accounts available");
    }

    // use the first account
    const address = getAddress(addr);

    // get the chainId the provider is on
    this.chainId = await provider
      .request({ method: "eth_chainId" })
      .then(normalizeChainId);

    this.updateMetadata();

    // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
    if (targetChainId && targetChainId !== this.chainId) {
      await this.switchChain(targetChainId);
    }

    if (provider.on) {
      provider.on("chainChanged", this.onChainChanged);
      provider.on("disconnect", this.onDisconnect);
    }

    this.events = {
      addListener(event, listener) {
        if (provider.on) {
          provider.on(event, listener);
        }
      },
      removeListener(event, listener) {
        if (provider.removeListener) {
          provider.removeListener(event, listener);
        }
      },
    };

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
              gas: tx.gas ? toHex(tx.gas) : undefined,
              value: tx.value ? toHex(tx.value) : undefined,
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
   * Call this method when the wallet provider chain is changed
   * Note: must use arrow function
   * @internal
   */
  private onChainChanged = (chainId: string) => {
    this.chainId = normalizeChainId(chainId);
  };

  /**
   * Call this method when the wallet provider is disconnected
   * Note: must use arrow function
   * @internal
   */
  private onDisconnect = () => {
    if (this.provider?.removeListener) {
      this.provider.removeListener("chainChanged", this.onChainChanged);
    }

    this.account = undefined;
    this.chainId = undefined;
  };

  /**
   * Method to get the injected provider
   * @internal
   */
  private getProvider(): Ethereum {
    let _provider: Ethereum | undefined;

    // if walletId is specified, get the provider from the store using EIP-6963
    if (this.options?.walletId) {
      _provider = injectedProvider(this.options.walletId);
      if (_provider) {
        return _provider;
      }
    }

    // if getProvider is specified, use that
    else if (this.options?.getProvider) {
      _provider = this.options.getProvider();
      if (_provider) {
        return _provider;
      }
    }

    // If neither are specified, use the `window.ethereum` provider
    else {
      _provider = defaultInjectedProvider();
    }

    if (!_provider) {
      throw new Error("no injected provider available");
    }

    return _provider;
  }

  /**
   * Update the metadata property of the wallet after wallet is connected
   * @internal
   */
  private updateMetadata() {
    // if a custom metadata is specified, return
    // if the walletId is not specified, return
    if (!this.options?.metadata || !this.options?.walletId) {
      return;
    }

    const store = getMIPDStore();
    const providerDetail = store.findProvider({
      rdns: this.options.walletId,
    });

    if (!providerDetail) {
      return;
    }

    this.metadata = {
      id: this.options.walletId,
      name: providerDetail.info.name,
      iconUrl: providerDetail.info.icon,
    };
  }
}

/**
 * @internal
 */
function defaultInjectedProvider(): Ethereum | undefined {
  if (typeof window !== "undefined" && "ethereum" in window) {
    return window.ethereum as Ethereum;
  }

  return undefined;
}
