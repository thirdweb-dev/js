import type { Address } from "abitype";
import * as ox__Hex from "ox/Hex";
import * as ox__TypedData from "ox/TypedData";
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
import { stringify } from "../../utils/json.js";
import { parseTypedData } from "../../utils/signatures/helpers/parse-typed-data.js";
import { BASE_ACCOUNT } from "../constants.js";
import { toGetCallsStatusResponse } from "../eip5792/get-calls-status.js";
import { toGetCapabilitiesResult } from "../eip5792/get-capabilities.js";
import { toProviderCallParams } from "../eip5792/send-calls.js";
import type {
  GetCallsStatusRawResponse,
  WalletCapabilities,
} from "../eip5792/types.js";
import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type { AppMetadata, DisconnectFn, SwitchChainFn } from "../types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { WalletEmitter } from "../wallet-emitter.js";
import type {
  CreateWalletArgs,
  WalletConnectionOption,
} from "../wallet-types.js";

// Base Account SDK Provider interface (EIP-1193 compatible)
export interface BaseAccountProvider {
  request<T = unknown>(args: {
    method: string;
    params?: unknown[];
  }): Promise<T>;
  on(event: string, handler: (...args: unknown[]) => void): void;
  removeListener(event: string, handler: (...args: unknown[]) => void): void;
  disconnect(): Promise<void>;
}

export type BaseAccountWalletCreationOptions =
  | {
      /**
       * Metadata of the dApp that will be passed to connected wallet.
       *
       * Some wallets may display this information to the user.
       *
       * Setting this property is highly recommended. If this is not set, Below default metadata will be used:
       *
       * ```ts
       * {
       *   name: "thirdweb powered dApp",
       *   url: "https://thirdweb.com",
       *   description: "thirdweb powered dApp",
       *   logoUrl: "https://thirdweb.com/favicon.ico",
       * };
       * ```
       */
      appMetadata?: AppMetadata;

      /**
       * Chains that the wallet can switch chains to, will default to the first chain in this array on first connection.
       * @default Ethereum mainnet
       * @example
       * ```ts
       * {
       *   chains: [base, optimism]
       * }
       * ```
       */
      chains?: Chain[];

      /**
       * Enable testnet mode for Base Account SDK
       * @default false
       */
      testnet?: boolean;
    }
  | undefined;

/**
 * Options for connecting to the Base Account SDK Wallet
 */
export type BaseAccountSDKWalletConnectionOptions = {
  /**
   * The Thirdweb client object
   */
  client: ThirdwebClient;

  /**
   * If you want the wallet to be connected to a specific blockchain, you can pass a `Chain` object to the `connect` method.
   * This will trigger a chain switch if the wallet provider is not already connected to the specified chain.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain.
   *
   * ```ts
   * import { defineChain } from "thirdweb";
   * const myChain = defineChain(myChainId);
   *
   * const address = await wallet.connect({ chain: myChain })
   */
  chain?: Chain;
};

// Need to keep the provider around because it keeps connection state
let _provider: BaseAccountProvider | undefined;

/**
 * @internal
 */
export async function getBaseAccountWebProvider(
  options?: CreateWalletArgs<typeof BASE_ACCOUNT>[1],
): Promise<BaseAccountProvider> {
  if (!_provider) {
    const { createBaseAccountSDK } = await import("@base-org/account");

    const sdk = createBaseAccountSDK({
      appName:
        options?.appMetadata?.name || getDefaultAppMetadata().name || "thirdweb powered dApp",
      testnet: options?.testnet ?? false,
    });

    const provider = sdk.getProvider() as BaseAccountProvider;
    _provider = provider;
    return provider;
  }
  return _provider;
}

/**
 * Checks if the provided wallet is a Base Account SDK wallet.
 *
 * @param wallet - The wallet to check.
 * @returns True if the wallet is a Base Account SDK wallet, false otherwise.
 */
export function isBaseAccountSDKWallet(
  wallet: Wallet,
): wallet is Wallet<typeof BASE_ACCOUNT> {
  return wallet.id === BASE_ACCOUNT;
}

function createAccount({
  provider,
  address,
  client,
}: {
  provider: BaseAccountProvider;
  address: string;
  client: ThirdwebClient;
}) {
  const account: Account = {
    address: getAddress(address),
    async sendTransaction(tx: SendTransactionOption) {
      const transactionHash = (await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            accessList: tx.accessList,
            data: tx.data,
            from: getAddress(address),
            gas: tx.gas ? numberToHex(tx.gas) : undefined,
            to: tx.to as Address,
            value: tx.value ? numberToHex(tx.value) : undefined,
          },
        ],
      })) as Hex;

      trackTransaction({
        chainId: tx.chainId,
        client: client,
        contractAddress: tx.to ?? undefined,
        gasPrice: tx.gasPrice,
        transactionHash,
        walletAddress: getAddress(address),
        walletType: BASE_ACCOUNT,
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

      const res = await provider.request({
        method: "personal_sign",
        params: [messageToSign, account.address],
      });
      if (!ox__Hex.validate(res)) {
        throw new Error("Invalid signature returned");
      }
      return res;
    },
    async signTypedData(typedData) {
      if (!account.address) {
        throw new Error("Provider not setup");
      }

      const { domain, message, primaryType } = parseTypedData(
        typedData,
      ) as ox__TypedData.Definition;

      const types = {
        EIP712Domain: ox__TypedData.extractEip712DomainTypes(domain),
        ...typedData.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      ox__TypedData.validate({ domain, message, primaryType, types });

      const stringifiedData = ox__TypedData.serialize({
        domain: domain ?? {},
        message,
        primaryType,
        types,
      });

      const res = await provider.request({
        method: "eth_signTypedData_v4",
        params: [account.address, stringifiedData],
      });
      if (!ox__Hex.validate(res)) {
        throw new Error("Invalid signed payload returned");
      }
      return res;
    },
    sendCalls: async (options) => {
      try {
        const { callParams, chain } = await toProviderCallParams(
          options,
          account,
        );
        const callId = await provider.request({
          method: "wallet_sendCalls",
          params: callParams,
        });
        if (callId && typeof callId === "object" && "id" in callId) {
          return { chain, client, id: callId.id as string };
        }
        return { chain, client, id: callId as string };
      } catch (error) {
        if (/unsupport|not support/i.test((error as Error).message)) {
          throw new Error(
            `${BASE_ACCOUNT} errored calling wallet_sendCalls, with error: ${error instanceof Error ? error.message : stringify(error)}`,
          );
        }
        throw error;
      }
    },
    async getCallsStatus(options) {
      try {
        const rawResponse = (await provider.request({
          method: "wallet_getCallsStatus",
          params: [options.id],
        })) as GetCallsStatusRawResponse;
        return toGetCallsStatusResponse(rawResponse);
      } catch (error) {
        if (/unsupport|not support/i.test((error as Error).message)) {
          throw new Error(
            `${BASE_ACCOUNT} does not support wallet_getCallsStatus, reach out to them directly to request EIP-5792 support.`,
          );
        }
        throw error;
      }
    },
    async getCapabilities(options) {
      const chainId = options.chainId;
      try {
        const result = (await provider.request({
          method: "wallet_getCapabilities",
          params: [getAddress(account.address)],
        })) as Record<string, WalletCapabilities>;
        return toGetCapabilitiesResult(result, chainId);
      } catch (error: unknown) {
        if (
          /unsupport|not support|not available/i.test((error as Error).message)
        ) {
          return {
            message: `${BASE_ACCOUNT} does not support wallet_getCapabilities, reach out to them directly to request EIP-5792 support.`,
          };
        }
        throw error;
      }
    },
  };

  return account;
}

function onConnect(
  address: string,
  chain: Chain,
  provider: BaseAccountProvider,
  emitter: WalletEmitter<typeof BASE_ACCOUNT>,
  client: ThirdwebClient,
): [Account, Chain, DisconnectFn, SwitchChainFn] {
  const account = createAccount({ address, client, provider });

  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    await provider.disconnect();
  }

  async function onDisconnect() {
    disconnect();
    emitter.emit("disconnect", undefined);
  }

  function onAccountsChanged(accounts: string[]) {
    if (accounts[0]) {
      const newAccount = createAccount({
        address: getAddress(accounts[0]),
        client,
        provider,
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

  // subscribe to events
  provider.on("accountsChanged", onAccountsChanged);
  provider.on("chainChanged", onChainChanged);
  provider.on("disconnect", onDisconnect);

  return [
    account,
    chain,
    onDisconnect,
    (newChain) => switchChainBaseAccountSDK(provider, newChain),
  ];
}

/**
 * @internal
 */
export async function connectBaseAccountSDK(
  options: WalletConnectionOption<typeof BASE_ACCOUNT>,
  emitter: WalletEmitter<typeof BASE_ACCOUNT>,
  provider: BaseAccountProvider,
): Promise<ReturnType<typeof onConnect>> {
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

  const chainId = normalizeChainId(connectedChainId);
  let chain =
    options.chain && options.chain.id === chainId
      ? options.chain
      : getCachedChain(chainId);
  // Switch to chain if provided
  if (chainId && options?.chain && chainId !== options?.chain.id) {
    await switchChainBaseAccountSDK(provider, options.chain);
    chain = options.chain;
  }

  return onConnect(address, chain, provider, emitter, options.client);
}

/**
 * @internal
 */
export async function autoConnectBaseAccountSDK(
  options: WalletConnectionOption<typeof BASE_ACCOUNT>,
  emitter: WalletEmitter<typeof BASE_ACCOUNT>,
  provider: BaseAccountProvider,
): Promise<ReturnType<typeof onConnect>> {
  // connected accounts
  const addresses = (await provider.request({
    method: "eth_accounts",
  })) as string[];

  const address = addresses[0];

  if (!address) {
    throw new Error("No accounts found");
  }

  const connectedChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | number;
  const chainId = normalizeChainId(connectedChainId);
  const chain =
    options.chain && options.chain.id === chainId
      ? options.chain
      : getCachedChain(chainId);

  return onConnect(address, chain, provider, emitter, options.client);
}

async function switchChainBaseAccountSDK(
  provider: BaseAccountProvider,
  chain: Chain,
) {
  // check if chain is already connected
  const connectedChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | number;
  const connectedChain = getCachedChain(normalizeChainId(connectedChainId));
  if (connectedChain?.id === chain.id) {
    // chain is already connected, no need to switch
    return;
  }

  const chainIdHex = numberToHex(chain.id);

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    const apiChain = await getChainMetadata(chain);

    // Indicates chain is not added to provider
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
    if ((error as any)?.code === 4902) {
      // try to add the chain
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            blockExplorerUrls: apiChain.explorers?.map((x) => x.url) || [],
            chainId: chainIdHex,
            chainName: apiChain.name,
            nativeCurrency: apiChain.nativeCurrency, // no client id on purpose here
            rpcUrls: getValidPublicRPCUrl(apiChain),
          },
        ],
      });
    }
  }
}
