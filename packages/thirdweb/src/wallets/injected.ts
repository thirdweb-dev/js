import { getAddress, toHex, type Hex } from "viem";
import type { Address } from "abitype";
import type { Wallet } from "./interfaces/wallet.js";
import type { Ethereum } from "./interfaces/ethereum.js";
import { createStore } from "mipd";
import { normalizeChainId } from "./utils/normalizeChainId.js";

// start provider discovery on page load
const store = /* @__PURE__ */ createStore();

export type InjectedWallet = Wallet<{
  switchChain: (newChainId: bigint | number) => Promise<void>;
}>;

export type WalletRDNS =
  | "io.metamask"
  | "com.coinbase"
  | "io.zerion.wallet"
  | "me.rainbow"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export type InjectedWalletOptions = {
  chainId?: bigint | number | undefined;
  /**
   * If the wallet supports EIP-6963, simply specify the RDNS of the wallet provider.
   * Specify the wallet ID ( RDNS ) to use.
   */
  walletId?: WalletRDNS;

  /**
   * If the wallet does not support EIP-6963, pass a function to get the injected provider.
   * By Default, it will use `() => window.ethereum`.
   */
  getProvider?: () => Ethereum | undefined;
};

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
export async function injectedWallet(
  options?: InjectedWalletOptions,
): Promise<InjectedWallet> {
  /**
   * @internal
   */
  function getProvider(): Ethereum {
    let provider: Ethereum | undefined;

    // if walletId is specified, get the provider from the store using EIP-6963
    if (options?.walletId) {
      provider = injectedProvider(options.walletId);
    }

    // if getProvider is specified, use that
    else if (options?.getProvider) {
      provider = options.getProvider();
    }

    // If neither are specified, use the `window.ethereum` provider
    else {
      provider = defaultInjectedProvider();
    }

    if (!provider) {
      throw new Error("no injected provider available");
    }

    return provider;
  }

  const provider = getProvider();

  // request accounts
  const accountAddresses = await provider.request({
    method: "eth_requestAccounts",
  });

  if (accountAddresses.length === 0) {
    throw new Error("no accounts available");
  }

  // use the first account
  const address = getAddress(accountAddresses[0] as string);

  // get the chainId the provider is on
  let providerChainId = await provider
    .request({ method: "eth_chainId" })
    .then(normalizeChainId);

  /**
   * Switches the Ethereum chain to the specified chain ID.
   * @param newChainId - The new chain ID to switch to.
   * @returns A Promise that resolves when the chain switch is complete.
   * @example
   * ```ts
   * const wallet = await injectedWallet();
   *
   * await wallet.switchChain(137); // switch to polygon mainnet
   * ```
   */
  async function switchChain(newChainId: bigint | number) {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(newChainId) }],
    });
    // TODO handle add chain case etc
    providerChainId = normalizeChainId(newChainId);
  }

  // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
  if (options?.chainId && options.chainId !== providerChainId) {
    await switchChain(options.chainId);
  }

  return {
    address,
    chainId: providerChainId,
    sendTransaction: async (tx) => {
      if (normalizeChainId(tx.chainId) !== providerChainId) {
        await switchChain(tx.chainId);
      }

      const transactionHash = (await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            gas: tx.gas ? toHex(tx.gas) : undefined,
            from: address,
            to: tx.to as Address,
            data: tx.data,
          },
        ],
      })) as Hex;

      return {
        transactionHash,
      };
    },
    switchChain,
    id: "injected",
  };
}

/**
 * Returns `window.ethereum`
 * @internal
 */
function defaultInjectedProvider(): Ethereum | undefined {
  if (typeof window !== "undefined" && "ethereum" in window) {
    return window.ethereum as Ethereum;
  }

  return undefined;
}

/**
 * Get the details of Injected Provider with given a wallet ID (rdns) using [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) Provider Discovery.
 * @param walletId - The Wallet Id (rdns) to check.
 * @example
 * ```ts
 * import { isInjected } from "thirdweb/wallets";
 *
 * const metamaskProvider = injectedProvider("io.metamask");
 * const coinbaseProvider = injectedProvider("com.coinbase");
 * ```
 * @returns The details of the Injected Provider if it exists. `undefined` otherwise.
 */
export function injectedProvider(walletId: WalletRDNS): Ethereum | undefined {
  const providerDetail = store.findProvider({ rdns: walletId });

  if (providerDetail) {
    return providerDetail.provider as Ethereum;
  }

  return undefined;
}
