import type { EIP1193Provider } from "viem";
import {
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  serializeTypedData,
  validateTypedData,
} from "viem";
import { trackTransaction } from "../../analytics/track/transaction.js";
import type { Chain } from "../../chains/types.js";
import { getCachedChain, getChainMetadata } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getAddress } from "../../utils/address.js";
import {
  type Hex,
  numberToHex,
  stringToHex,
  uint8ArrayToHex,
} from "../../utils/encoding/hex.js";
import { parseTypedData } from "../../utils/signatures/helpers/parseTypedData.js";
import type { InjectedSupportedWalletIds } from "../__generated__/wallet-ids.js";
import type { Account, SendTransactionOption } from "../interfaces/wallet.js";
import type { DisconnectFn, SwitchChainFn } from "../types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { WalletEmitter } from "../wallet-emitter.js";
import type { WalletId } from "../wallet-types.js";
import { injectedProvider } from "./mipdStore.js";

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
export async function connectEip1193Wallet({
  id,
  provider,
  emitter,
  client,
  chain,
}: {
  id: InjectedSupportedWalletIds | ({} & string);
  provider: EIP1193Provider;
  client: ThirdwebClient;
  chain?: Chain;
  emitter: WalletEmitter<InjectedSupportedWalletIds>;
}): Promise<ReturnType<typeof onConnect>> {
  let addresses: string[] | undefined;
  const retries = 3;
  let attempts = 0;
  // retry 3 times, some providers take a while to return accounts on connect
  while (!addresses?.[0] && attempts < retries) {
    try {
      addresses = await provider.request({
        method: "eth_requestAccounts",
      });
    } catch (e) {
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    attempts++;
  }

  const addr = addresses?.[0];
  if (!addr) {
    throw new Error("Failed to connect to wallet, no accounts available");
  }

  // use the first account
  const address = getAddress(addr);

  // get the chainId the provider is on
  const chainId = await provider
    .request({ method: "eth_chainId" })
    .then(normalizeChainId);

  let connectedChain =
    chain && chain.id === chainId ? chain : getCachedChain(chainId);

  // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
  if (chain && chain.id !== chainId) {
    await switchChain(provider, chain);
    connectedChain = chain;
  }

  return onConnect({
    provider,
    address,
    chain: connectedChain,
    emitter,
    client,
    id,
  });
}

/**
 * @internal
 */
export async function autoConnectEip1193Wallet({
  id,
  provider,
  emitter,
  client,
  chain,
}: {
  id: InjectedSupportedWalletIds | ({} & string);
  provider: EIP1193Provider;
  emitter: WalletEmitter<InjectedSupportedWalletIds>;
  client: ThirdwebClient;
  chain?: Chain;
}): Promise<ReturnType<typeof onConnect>> {
  // connected accounts
  const addresses = await provider.request({
    method: "eth_accounts",
  });

  const addr = addresses[0];
  if (!addr) {
    throw new Error("Failed to connect to wallet, no accounts available");
  }

  // use the first account
  const address = getAddress(addr);

  // get the chainId the provider is on
  const chainId = await provider
    .request({ method: "eth_chainId" })
    .then(normalizeChainId);

  const connectedChain =
    chain && chain.id === chainId ? chain : getCachedChain(chainId);

  return onConnect({
    provider,
    address,
    chain: connectedChain,
    emitter,
    client,
    id,
  });
}

function createAccount({
  provider,
  address,
  client,
  id,
}: {
  provider: EIP1193Provider;
  address: string;
  client: ThirdwebClient;
  id: WalletId | ({} & string);
}) {
  const account: Account = {
    address: getAddress(address),
    async sendTransaction(tx: SendTransactionOption) {
      const gasFees = tx.gasPrice
        ? {
            gasPrice: tx.gasPrice ? numberToHex(tx.gasPrice) : undefined,
          }
        : {
            maxFeePerGas: tx.maxFeePerGas
              ? numberToHex(tx.maxFeePerGas)
              : undefined,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas
              ? numberToHex(tx.maxPriorityFeePerGas)
              : undefined,
          };
      const params = [
        {
          ...gasFees,
          nonce: tx.nonce ? numberToHex(tx.nonce) : undefined,
          accessList: tx.accessList,
          value: tx.value ? numberToHex(tx.value) : undefined,
          gas: tx.gas ? numberToHex(tx.gas) : undefined,
          from: this.address,
          to: tx.to ? getAddress(tx.to) : undefined,
          data: tx.data,
          ...tx.eip712,
        },
      ];

      const transactionHash = (await provider.request({
        method: "eth_sendTransaction",
        // @ts-expect-error - overriding types here
        params,
      })) as Hex;

      trackTransaction({
        client,
        chainId: tx.chainId,
        walletAddress: getAddress(address),
        walletType: id,
        transactionHash,
        contractAddress: tx.to ?? undefined,
        gasPrice: tx.gasPrice,
      });

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
async function onConnect({
  provider,
  address,
  chain,
  emitter,
  client,
  id,
}: {
  provider: EIP1193Provider;
  address: string;
  chain: Chain;
  emitter: WalletEmitter<InjectedSupportedWalletIds>;
  client: ThirdwebClient;
  id: WalletId | ({} & string);
}): Promise<[Account, Chain, DisconnectFn, SwitchChainFn]> {
  const account = createAccount({ provider, address, client, id });
  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
  }

  async function onDisconnect() {
    disconnect();
    emitter.emit("disconnect", undefined);
  }

  function onAccountsChanged(accounts: string[]) {
    if (accounts[0]) {
      const newAccount = createAccount({
        provider,
        address: getAddress(accounts[0]),
        client,
        id,
      });

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
    onDisconnect,
    (newChain) => switchChain(provider, newChain),
  ] as const;
}

/**
 * @internal
 */
async function switchChain(provider: EIP1193Provider, chain: Chain) {
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
