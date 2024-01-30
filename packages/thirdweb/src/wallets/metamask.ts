import { getAddress, toHex, type Hex } from "viem";

import type { Address } from "abitype";

import type { Wallet } from "./interfaces/wallet.js";
import type { Ethereum } from "./interfaces/ethereum.js";

export type MetamaskWalletOptions = {
  chainId?: bigint | number;
};

/**
 * Creates a Metamask wallet instance.
 * @param options - The options for the Metamask wallet.
 * @returns A Promise that resolves to a Metamask wallet instance.
 * @throws Error if no injected provider is available or no accounts are available.
 * @example
 * ```ts
 * import { metamaskWallet } from "thirdweb/wallets";
 * const wallet = await metamaskWallet();
 * ```
 */
export async function metamaskWallet(options?: MetamaskWalletOptions) {
  if (!hasInjectedProvider(globalThis.window)) {
    throw new Error("no injected provider available");
  }
  // we now know that we have a provider
  const provider = globalThis.window.ethereum;

  // has to be a separate step
  const accountAddresses = await provider.request({
    method: "eth_requestAccounts",
  });
  if (accountAddresses.length === 0) {
    throw new Error("no accounts available");
  }
  const address = getAddress(accountAddresses[0] as string);
  let providerChainId = await provider
    .request({ method: "eth_chainId" })
    .then(normalizeChainId);

  // DEFINE SWITCH CHAIN FUNCTION

  /**
   * Switches the Ethereum chain to the specified chain ID.
   * @param newChainId - The new chain ID to switch to.
   * @returns A Promise that resolves when the chain switch is complete.
   * @internal
   */
  async function switchChain(newChainId: bigint | number) {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(newChainId) }],
    });
    // TODO handle add chain case etc
    providerChainId = normalizeChainId(newChainId);
  }

  // if we want a specific chainId and it is not the same as the provider chainId, switch!
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
  } satisfies Wallet<{
    switchChain: (newChainId: bigint | number) => Promise<void>;
  }>;
}

// helpers //

interface WindowWithEthereum extends Window {
  ethereum: Ethereum;
}

/**
 * @internal
 */
function hasInjectedProvider(w: Window): w is WindowWithEthereum {
  return typeof w !== "undefined" && !!w && "ethereum" in w && !!w.ethereum;
}

/**
 * @internal
 */
function normalizeChainId(chainId: string | number | bigint) {
  // always want a bigint in the end and it alreayd handles
  // hex
  // integer
  // bigint
  return BigInt(chainId);
}
