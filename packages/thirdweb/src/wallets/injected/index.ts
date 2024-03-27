import {
  getTypesForEIP712Domain,
  validateTypedData,
  type SignTypedDataParameters,
} from "viem";
import type { Address } from "abitype";
import type { Ethereum } from "../interfaces/ethereum.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import { injectedProvider } from "./mipdStore.js";
import type {
  SendTransactionOption,
  Account,
  Wallet,
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
import type { InjectedConnectOptions, WalletId } from "../wallet-types.js";

import type { InjectedSupportedWalletIds } from "../__generated__/wallet-ids.js";

// TODO: save the provider in data

function getInjectedProvider(walletId: WalletId) {
  const provider = injectedProvider(walletId);
  if (!provider) {
    throw new Error(`no injected provider found for wallet: "${walletId}"`);
  }

  return provider;
}

/**
 * @internal
 */
export async function connectInjectedWallet(
  wallet: Wallet<InjectedSupportedWalletIds>,
  options: InjectedConnectOptions,
) {
  const provider = getInjectedProvider(wallet.id);
  const addresses = await provider.request({
    method: "eth_requestAccounts",
  });

  return onConnect(wallet, {
    provider,
    addresses,
    chain: options.chain ? options.chain : undefined,
  });
}

/**
 * @internal
 */
export async function autoConnectInjectedWallet(
  wallet: Wallet<InjectedSupportedWalletIds>,
) {
  const provider = getInjectedProvider(wallet.id);

  // connected accounts
  const addresses = await provider.request({
    method: "eth_accounts",
  });

  return onConnect(wallet, {
    provider,
    addresses,
    // do not force switch chain on autoConnect
    chain: undefined,
  });
}

/**
 * @internal
 */
export async function switchChainInjectedWallet(
  wallet: Wallet<InjectedSupportedWalletIds>,
  chain: Chain,
) {
  const provider = getInjectedProvider(wallet.id);
  const hexChainId = numberToHex(chain.id);
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
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

/**
 * Call this method when the wallet provider is connected or auto connected
 * @internal
 */
async function onConnect(
  wallet: Wallet<InjectedSupportedWalletIds>,
  data: {
    chain?: Chain;
    provider: Ethereum;
    addresses: string[];
  },
): Promise<[Account, Chain]> {
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

  let connectedChain = defineChain(chainId);
  // const walletData = getWalletData(wallet);

  // if (walletData) {
  //   walletData.chain = defineChain(chainId);
  // }

  // this.updateMetadata();

  // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
  if (chain && chain.id !== chainId) {
    await wallet.switchChain(chain);
    connectedChain = chain;
  }

  const onDisconnect = () => {
    // if (walletData) {
    //   walletData.onDisconnect();
    //   provider.removeListener("chainChanged", walletData.onChainChanged);
    // }
  };

  if (provider.on) {
    // if (walletData) {
    //   provider.on("chainChanged", walletData.onChainChanged);
    // }

    provider.on("disconnect", onDisconnect);
  }

  wallet.events = {
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

  return [account, connectedChain] as const;
}
