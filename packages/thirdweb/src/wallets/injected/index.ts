import type { Address } from "abitype";
import {
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  serializeTypedData,
  validateTypedData,
} from "viem";
import type { Chain } from "../../chains/types.js";
import { getCachedChain, getChainMetadata } from "../../chains/utils.js";
import { getAddress } from "../../utils/address.js";
import {
  type Hex,
  numberToHex,
  stringToHex,
  uint8ArrayToHex,
} from "../../utils/encoding/hex.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { InjectedConnectOptions, WalletId } from "../wallet-types.js";
import { injectedProvider } from "./mipdStore.js";

import { parseTypedData } from "../../utils/signatures/helpers/parseTypedData.js";
import type { InjectedSupportedWalletIds } from "../__generated__/wallet-ids.js";
import type { DisconnectFn, SwitchChainFn } from "../types.js";
import type { WalletEmitter } from "../wallet-emitter.js";

/**
 * Checks if the provided wallet is an injected wallet.
 *
 * @param wallet - The wallet to check.
 * @returns True if the wallet is an injected wallet, false otherwise.
 */
export function isInjectedWallet(wallet: Wallet<WalletId>) {
  return !!injectedProvider(wallet.id);
}

// TODO: save the provider in data
export function getInjectedProvider(walletId: WalletId) {
  const provider = injectedProvider(walletId);
  if (!provider) {
    throw new Error(`No injected provider found for wallet: "${walletId}"`);
  }

  return provider;
}

/**
 * @internal
 */
export async function connectInjectedWallet(
  id: InjectedSupportedWalletIds,
  options: InjectedConnectOptions,
  emitter: WalletEmitter<InjectedSupportedWalletIds>,
): Promise<ReturnType<typeof onConnect>> {
  const provider = getInjectedProvider(id);
  const addresses = await provider.request({
    method: "eth_requestAccounts",
  });

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

  let connectedChain =
    options.chain && options.chain.id === chainId
      ? options.chain
      : getCachedChain(chainId);

  // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
  if (options.chain && options.chain.id !== chainId) {
    await switchChain(provider, options.chain);
    connectedChain = options.chain;
  }

  return onConnect(provider, address, connectedChain, emitter);
}

/**
 * @internal
 */
export async function autoConnectInjectedWallet(
  id: InjectedSupportedWalletIds,
  emitter: WalletEmitter<InjectedSupportedWalletIds>,
  chain?: Chain,
): Promise<ReturnType<typeof onConnect>> {
  const provider = getInjectedProvider(id);

  // connected accounts
  const addresses = await provider.request({
    method: "eth_accounts",
  });

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

  const connectedChain =
    chain && chain.id === chainId ? chain : getCachedChain(chainId);

  return onConnect(provider, address, connectedChain, emitter);
}

function createAccount(provider: Ethereum, address: string) {
  const account: Account = {
    address,
    async sendTransaction(tx: SendTransactionOption) {
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
      if (!provider || !account.address) {
        throw new Error("Provider not setup");
      }
      const parsedTypedData = parseTypedData(typedData);

      const { domain, message, primaryType } =
        parsedTypedData as unknown as SignTypedDataParameters;

      const types = {
        EIP712Domain: getTypesForEIP712Domain({ domain }),
        ...parsedTypedData.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      validateTypedData({ domain, message, primaryType, types });

      const stringifiedData = serializeTypedData({
        domain: domain ?? {},
        message,
        primaryType,
        types,
      });

      return await provider.request({
        method: "eth_signTypedData_v4",
        params: [account.address, stringifiedData],
      });
    },
    async watchAsset(asset) {
      const result = await provider.request(
        {
          method: "wallet_watchAsset",
          params: asset,
        },
        { retryCount: 0 },
      );
      return result;
    },
  };

  return account;
}

/**
 * Call this method when the wallet provider is connected or auto connected
 * @internal
 */
async function onConnect(
  provider: Ethereum,
  address: string,
  chain: Chain,
  emitter: WalletEmitter<InjectedSupportedWalletIds>,
): Promise<[Account, Chain, DisconnectFn, SwitchChainFn]> {
  const account = createAccount(provider, address);
  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
  }

  function onDisconnect() {
    disconnect();
    emitter.emit("disconnect", undefined);
  }

  function onAccountsChanged(accounts: string[]) {
    if (accounts[0]) {
      const newAccount = createAccount(provider, getAddress(accounts[0]));

      emitter.emit("accountChanged", newAccount);
      emitter.emit("accountsChanged", accounts);
    } else {
      onDisconnect();
    }
  }

  function onChainChanged(newChainId: string) {
    const newChain = getCachedChain(normalizeChainId(newChainId));
    emitter.emit("chainChanged", newChain);
  }

  if (provider.on) {
    provider.on("accountsChanged", onAccountsChanged);
    provider.on("chainChanged", onChainChanged);
    provider.on("disconnect", onDisconnect);
  }

  return [
    account,
    chain,
    disconnect,
    (newChain) => switchChain(provider, newChain),
  ] as const;
}

/**
 * @internal
 */
async function switchChain(provider: Ethereum, chain: Chain) {
  const hexChainId = numberToHex(chain.id);
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  } catch (e: any) {
    // if chain does not exist, add the chain
    if (e?.code === 4902 || e?.data?.originalError?.code === 4902) {
      const apiChain = await getChainMetadata(chain);
      await provider.request({
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
}
