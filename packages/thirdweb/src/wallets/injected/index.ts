import { getAddress, toHex, type Hex } from "viem";
import type { Address } from "abitype";
import type { Ethereum } from "../interfaces/ethereum.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { InjectedWalletOptions } from "./types.js";
import { getMIPDStore, injectedProvider } from "./mipdStore.js";
import type {
  WalletConnectionOptions,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";

/**
 * Connect to Injected Wallet Provider
 * @param options - The options for connecting to the Injected Wallet Provider.
 * @returns A Promise that resolves to a Wallet instance.
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
export async function injectedWallet(options?: InjectedWalletOptions) {
  return new InjectedWallet(options);
}

/**
 * Connect to an Injected Wallet Provider
 */
export class InjectedWallet implements Wallet {
  address: Wallet["address"];
  metadata: Wallet["metadata"];
  chainId: Wallet["chainId"];
  events: Wallet["events"];

  #options?: InjectedWalletOptions;
  #provider?: Ethereum;

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
    this.#options = options;
    this.address = ""; // TODO: allow undefined address in Wallet interface
    this.metadata = this.#options?.metadata || {
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
    const provider = this.#getProvider();
    this.#provider = provider;

    // connected accounts
    const accounts = await provider.request({
      method: "eth_accounts",
    });

    return this.#onConnect({
      provider,
      accounts,
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
  async connect(options?: WalletConnectionOptions) {
    const provider = this.#getProvider();
    this.#provider = provider;

    const accountAddresses = await provider.request({
      method: "eth_requestAccounts",
    });

    return this.#onConnect({
      provider,
      accounts: accountAddresses,
      targetChainId: options?.chainId,
    });
  }

  /**
   * Send a transaction using the Injected Wallet Provider
   * @param tx - Transaction object
   * @example
   * ```ts
   * const { transactionHash } = await wallet.sendTransaction(tx)
   * ```
   * @returns A Promise that resolves to the transaction hash.
   */
  async sendTransaction(tx: SendTransactionOption) {
    if (!this.chainId || !this.#provider || !this.address) {
      throw new Error("Provider not setup");
    }

    if (normalizeChainId(tx.chainId) !== this.chainId) {
      await this.switchChain(tx.chainId);
    }

    const transactionHash = (await this.#provider.request({
      method: "eth_sendTransaction",
      params: [
        {
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
  }

  /**
   * Disconnect from the Injected Wallet Provider
   * @example
   * ```ts
   * await wallet.disconnect()
   * ```
   */
  async disconnect() {
    this.#onDisconnect();
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
    if (!this.#provider) {
      throw new Error("no provider available");
    }

    await this.#provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(chainId) }],
    });

    // TODO handle add chain case etc
    this.chainId = normalizeChainId(chainId);
  }

  /**
   * Call this method when the wallet provider is connected or auto connected
   * @internal
   */
  async #onConnect(data: {
    targetChainId?: number | bigint;
    provider: Ethereum;
    accounts: string[];
  }): Promise<typeof this> {
    const { accounts, provider, targetChainId } = data;
    const account = accounts[0];
    if (!account) {
      throw new Error("no accounts available");
    }

    // use the first account
    this.address = getAddress(account);

    // get the chainId the provider is on
    this.chainId = await provider
      .request({ method: "eth_chainId" })
      .then(normalizeChainId);

    this.#updateMetadata();

    // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
    if (targetChainId && targetChainId !== this.chainId) {
      await this.switchChain(targetChainId);
    }

    if (provider.on) {
      provider.on("accountsChanged", this.#onAccountsChanged);
      provider.on("chainChanged", this.#onChainChanged);
      provider.on("disconnect", this.#onDisconnect);
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

    return this;
  }

  /**
   * Note: must use arrow function
   * @internal
   */
  #onAccountsChanged = (accounts: string[]) => {
    const _address = accounts[0];
    if (!_address) {
      // TODO figure out a way to handle this, address is not allowed to be undefined
      // @ts-expect-error - address is not allowed to be undefined
      this.address = undefined;
      this.#onDisconnect();
    } else {
      this.address = getAddress(_address);
    }
  };

  /**
   * Call this method when the wallet provider chain is changed
   * Note: must use arrow function
   * @internal
   */
  #onChainChanged = (chainId: string) => {
    this.chainId = normalizeChainId(chainId);
  };

  /**
   * Call this method when the wallet provider is disconnected
   * Note: must use arrow function
   * @internal
   */
  #onDisconnect = () => {
    if (this.#provider?.removeListener) {
      this.#provider.removeListener("accountsChanged", this.#onAccountsChanged);
      this.#provider.removeListener("chainChanged", this.#onChainChanged);
    }

    this.chainId = undefined;
    this.address = ""; // TODO: allow undefined address in Wallet interface
  };

  /**
   * Method to get the injected provider
   * @internal
   */
  #getProvider(): Ethereum {
    let _provider: Ethereum | undefined;

    // if walletId is specified, get the provider from the store using EIP-6963
    if (this.#options?.walletId) {
      _provider = injectedProvider(this.#options.walletId);
      if (_provider) {
        return _provider;
      }
    }

    // if getProvider is specified, use that
    else if (this.#options?.getProvider) {
      _provider = this.#options.getProvider();
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
  #updateMetadata() {
    // if a custom metadata is specified, return
    // if the walletId is not specified, return
    if (!this.#options?.metadata || !this.#options?.walletId) {
      return;
    }

    const store = getMIPDStore();
    const providerDetail = store.findProvider({
      rdns: this.#options.walletId,
    });

    if (!providerDetail) {
      return;
    }

    this.metadata = {
      id: this.#options.walletId,
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
