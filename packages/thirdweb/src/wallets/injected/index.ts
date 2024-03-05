import {
  getTypesForEIP712Domain,
  validateTypedData,
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
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { stringify } from "../../utils/json.js";
import { defineChain, getChainMetadata } from "../../chains/utils.js";
import type { Chain } from "../../chains/types.js";
import {
  isHex,
  numberToHex,
  stringToHex,
  uint8ArrayToHex,
  type Hex,
} from "../../utils/encoding/hex.js";
import { getAddress } from "../../utils/address.js";

/**
 * Connect to Injected Wallet Provider
 * @param options - The options for connecting to the Injected Wallet Provider.
 * @example
 * Connecting the wallet by using [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) by passing the wallet's `rdns` as `walletId`.
 * ```ts
 * import { injectedWallet } from "thirdweb/wallets";
 *
 * // Using the Wallet Id
 * const wallet = await injectedWallet({
 *  walletId: "io.metamask",
 * });
 * ```
 *
 * Using custom logic to get the provider
 * ```ts
 * const wallet = await injectedWallet({
 *  getProvider() {
 *   return window.xfi?.ethereum; // Example of XDEFI Wallet
 *  }
 * });
 * ```
 *
 * Connecting to `window.ethereum` provider - whichever wallet it may be
 * ```ts
 * // Using the default `window.ethereum` provider
 * const wallet = await injectedWallet();
 * ```
 * @wallet
 * @returns The Wallet instance.
 */
export function injectedWallet(options?: InjectedWalletOptions) {
  return new InjectedWallet(options);
}

/**
 * Wallet interface for connecting to Injected Wallet Provider.
 *
 * It supports connecting to the Injected Wallet Provider using [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) or connecting to any arbitrary injected `Ethereum` provider.
 */
export class InjectedWallet implements Wallet {
  metadata: Wallet["metadata"];
  events: Wallet["events"];

  private chain: Chain | undefined;
  private account?: Account | undefined;
  private options?: InjectedWalletOptions;
  private provider?: Ethereum;

  /**
   * Create Injected Wallet instance
   * @param options - The options for connecting to the Injected Wallet Provider.
   * @example
   * ```ts
   * // connect to `window.ethereum` provider
   * const wallet = new InjectedWallet();
   *
   * // connect to a specific wallet provider using EIP-6963 - Pass the wallet rnds as `walletId`
   * const wallet = new InjectedWallet({
   *  walletId: "io.metamask",
   * })
   *
   * // connect to a specific wallet provider using custom logic
   * const wallet = new InjectedWallet({
   *  getProvider() {
   *    return window.xfi?.ethereum;
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
   * Auto connect to the wallet provider. This only succeeds if the wallet provider is still connected.
   *
   * Auto connect is useful to avoid asking the user to connect to the wallet provider again on page refresh or revisit.
   * @example
   * ```ts
   * const account = await wallet.autoConnect();
   * ```
   * @returns A Promise that resolves to the connected `Account`
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
      chain: undefined,
    });
  }

  /**
   * Connect to the Injected Wallet Provider
   * @param options - The options for connecting to the Injected Wallet Provider.
   * @example
   * Connect to the Injected Wallet Provider with no options.
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
      chain: options?.chain ? options.chain : undefined,
    });
  }

  /**
   * Disconnect from the Injected Wallet Provider.
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect() {
    this.onDisconnect();
  }

  /**
   * Switch the wallet to a different blockchain by passing the `Chain` object of it.
   * If the wallet already has the capability to connect to the blockchain, it will switch to it. If not, Wallet will prompt the user to confirm adding a new blockchain to the wallet.
   * Depending on the wallet - this action may require the user to confirm the switch chain request or add a new blockchain request.
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
   * await wallet.switchChain(mumbai)
   * ```
   */
  async switchChain(chain: Chain) {
    if (!this.provider) {
      throw new Error("no provider available");
    }
    const hexChainId = numberToHex(chain.id);
    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch (e: any) {
      // if chain does not exist, add the chain
      if (e?.code === 4902 || e?.data?.originalError?.code === 4902) {
        const apiChain = await getChainMetadata(chain);
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChainId,
              chainName: apiChain.name,
              nativeCurrency: apiChain.nativeCurrency,
              rpcUrls: getValidPublicRPCUrl(apiChain), // no client id on purpose here
              blockExplorerUrls: apiChain.explorers?.map((x) => x.url),
            },
          ],
        });
      } else {
        throw e;
      }
    }

    this.chain = chain;
  }

  /**
   * Call this method when the wallet provider is connected or auto connected
   * @internal
   */
  private async onConnect(data: {
    chain?: Chain;
    provider: Ethereum;
    addresses: string[];
  }): Promise<Account> {
    const { addresses, provider, chain } = data;
    const addr = addresses[0];
    if (!addr) {
      throw new Error("no accounts available");
    }

    // use the first account
    const address = getAddress(addr);

    // get the chainId the provider is on
    const chainId = await provider
      .request({ method: "eth_chainId" })
      .then(normalizeChainId);

    this.chain = defineChain(chainId);

    this.updateMetadata();

    // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
    if (chain && chain.id !== chainId) {
      await this.switchChain(chain);
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
   * Call this method when the wallet provider chain is changed
   * Note: must use arrow function
   * @internal
   */
  private onChainChanged = (newChainId: string) => {
    const chainId = normalizeChainId(newChainId);
    this.chain = defineChain(chainId);
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
    this.chain = undefined;
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
