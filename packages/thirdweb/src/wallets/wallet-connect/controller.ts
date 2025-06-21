import type { EthereumProvider } from "@walletconnect/ethereum-provider";
import type { Address } from "abitype";
import {
  getTypesForEIP712Domain,
  type ProviderRpcError,
  type SignTypedDataParameters,
  SwitchChainError,
  serializeTypedData,
  UserRejectedRequestError,
  validateTypedData,
} from "viem";
import { trackTransaction } from "../../analytics/track/transaction.js";
import type { Chain } from "../../chains/types.js";
import {
  getCachedChain,
  getChainMetadata,
  getRpcUrlForChain,
} from "../../chains/utils.js";
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
import type { AsyncStorage } from "../../utils/storage/AsyncStorage.js";
import {
  getSavedConnectParamsFromStorage,
  saveConnectParamsToStorage,
} from "../../utils/storage/walletStorage.js";
import { formatWalletConnectUrl } from "../../utils/url.js";
import { getWalletInfo } from "../__generated__/getWalletInfo.js";
import type { WCSupportedWalletIds } from "../__generated__/wallet-ids.js";
import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type { DisconnectFn, SwitchChainFn } from "../types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { WalletEmitter } from "../wallet-emitter.js";
import type { WalletId } from "../wallet-types.js";
import { DEFAULT_PROJECT_ID, NAMESPACE } from "./constants.js";
import type { WCAutoConnectOptions, WCConnectOptions } from "./types.js";

type WCProvider = InstanceType<typeof EthereumProvider>;

type SavedConnectParams = {
  optionalChains?: Chain[];
  chain?: Chain;
  pairingTopic?: string;
};

const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";

const defaultShowQrModal = true;

const storageKeys = {
  lastUsedChainId: "tw.wc.lastUsedChainId",
  requestedChains: "tw.wc.requestedChains",
};

/**
 * Checks if the provided wallet is a Wallet Connect wallet.
 *
 * @param wallet - The wallet to check.
 * @returns True if the wallet is a Wallet Connect wallet, false otherwise.
 */
export function isWalletConnect(
  wallet: Wallet<WalletId>,
): wallet is Wallet<"walletConnect"> {
  return wallet.id === "walletConnect";
}

/**
 * @internal
 */
export async function connectWC(
  options: WCConnectOptions,
  emitter: WalletEmitter<WCSupportedWalletIds>,
  walletId: WCSupportedWalletIds | "walletConnect",
  storage: AsyncStorage,
  sessionHandler?: (uri: string) => void,
): Promise<ReturnType<typeof onConnect>> {
  const provider = await initProvider(options, walletId, sessionHandler);
  const wcOptions = options.walletConnect;

  let { onDisplayUri } = wcOptions || {};

  // use default sessionHandler unless onDisplayUri is explicitly provided
  if (!onDisplayUri && sessionHandler) {
    const walletInfo = await getWalletInfo(walletId);
    const deeplinkHandler = (uri: string) => {
      const appUrl = walletInfo.mobile.native || walletInfo.mobile.universal;
      if (!appUrl) {
        // generic wc uri
        sessionHandler(uri);
        return;
      }
      const fullUrl = formatWalletConnectUrl(appUrl, uri).redirect;
      sessionHandler(fullUrl);
    };
    onDisplayUri = deeplinkHandler;
  }

  if (onDisplayUri) {
    provider.events.addListener("display_uri", onDisplayUri);
  }

  let optionalChains: Chain[] | undefined = wcOptions?.optionalChains;
  let chainToRequest = options.chain;

  // ignore the given options chains - and set the safe supported chains
  if (walletId === "global.safe") {
    optionalChains = chainsToRequestForSafe.map(getCachedChain);
    if (chainToRequest && !optionalChains.includes(chainToRequest)) {
      chainToRequest = undefined;
    }
  }

  const {
    rpcMap,
    requiredChain,
    optionalChains: chainsToRequest,
  } = getChainsToRequest({
    chain: chainToRequest,
    client: options.client,
    optionalChains: optionalChains,
  });

  if (provider.session) {
    await provider.connect({
      ...(wcOptions?.pairingTopic
        ? { pairingTopic: wcOptions?.pairingTopic }
        : {}),
      chains: requiredChain ? [requiredChain.id] : undefined,
      optionalChains: chainsToRequest,
      rpcMap: rpcMap,
    });
  }

  setRequestedChainsIds(chainsToRequest, storage);
  // If session exists and chains are authorized, enable provider for required chain
  const addresses = await provider.enable();
  const address = addresses[0];
  if (!address) {
    throw new Error("No accounts found on provider.");
  }

  const providerChainId = normalizeChainId(provider.chainId);

  const chain =
    options.chain && options.chain.id === providerChainId
      ? options.chain
      : getCachedChain(providerChainId);

  if (options) {
    const savedParams: SavedConnectParams = {
      chain: options.chain,
      optionalChains: options.walletConnect?.optionalChains,
      pairingTopic: options.walletConnect?.pairingTopic,
    };

    if (storage) {
      saveConnectParamsToStorage(storage, walletId, savedParams);
    }
  }

  if (wcOptions?.onDisplayUri) {
    provider.events.removeListener("display_uri", wcOptions.onDisplayUri);
  }

  return onConnect(address, chain, provider, emitter, storage, options.client);
}

/**
 * Auto connect to already connected wallet connect session.
 * @internal
 */
export async function autoConnectWC(
  options: WCAutoConnectOptions,
  emitter: WalletEmitter<WCSupportedWalletIds>,
  walletId: WCSupportedWalletIds | "walletConnect",
  storage: AsyncStorage,
  sessionHandler?: (uri: string) => void,
): Promise<ReturnType<typeof onConnect>> {
  const savedConnectParams: SavedConnectParams | null = storage
    ? await getSavedConnectParamsFromStorage(storage, walletId)
    : null;

  const provider = await initProvider(
    savedConnectParams
      ? {
          chain: savedConnectParams.chain,
          client: options.client,
          walletConnect: {
            optionalChains: savedConnectParams.optionalChains,
            pairingTopic: savedConnectParams.pairingTopic,
          },
        }
      : {
          client: options.client,
          walletConnect: {},
        },
    walletId,
    sessionHandler,
    true, // is auto connect
  );

  const address = provider.accounts[0];

  if (!address) {
    throw new Error("No accounts found on provider.");
  }

  const providerChainId = normalizeChainId(provider.chainId);

  const chain =
    options.chain && options.chain.id === providerChainId
      ? options.chain
      : getCachedChain(providerChainId);

  return onConnect(address, chain, provider, emitter, storage, options.client);
}

// Connection utils -----------------------------------------------------------------------------------------------

async function initProvider(
  options: WCConnectOptions,
  walletId: WCSupportedWalletIds | "walletConnect",
  sessionRequestHandler?: (uri: string) => void | Promise<void>,
  isAutoConnect = false,
) {
  const walletInfo = await getWalletInfo(walletId);
  const wcOptions = options.walletConnect;
  const { EthereumProvider, OPTIONAL_EVENTS, OPTIONAL_METHODS } = await import(
    "@walletconnect/ethereum-provider"
  );

  let optionalChains: Chain[] | undefined = wcOptions?.optionalChains;
  let chainToRequest = options.chain;

  // ignore the given options chains - and set the safe supported chains
  if (walletId === "global.safe") {
    optionalChains = chainsToRequestForSafe.map(getCachedChain);
    if (chainToRequest && !optionalChains.includes(chainToRequest)) {
      chainToRequest = undefined;
    }
  }

  const {
    rpcMap,
    requiredChain,
    optionalChains: chainsToRequest,
  } = getChainsToRequest({
    chain: chainToRequest,
    client: options.client,
    optionalChains: optionalChains,
  });

  const provider = await EthereumProvider.init({
    chains: requiredChain ? [requiredChain.id] : undefined,
    disableProviderPing: true,
    metadata: {
      description:
        wcOptions?.appMetadata?.description ||
        getDefaultAppMetadata().description,
      icons: [
        wcOptions?.appMetadata?.logoUrl || getDefaultAppMetadata().logoUrl,
      ],
      name: wcOptions?.appMetadata?.name || getDefaultAppMetadata().name,
      url: wcOptions?.appMetadata?.url || getDefaultAppMetadata().url,
    },
    optionalChains: chainsToRequest,
    optionalEvents: OPTIONAL_EVENTS,
    optionalMethods: OPTIONAL_METHODS,
    projectId: wcOptions?.projectId || DEFAULT_PROJECT_ID,
    qrModalOptions: wcOptions?.qrModalOptions,
    rpcMap: rpcMap,
    showQrModal:
      wcOptions?.showQrModal === undefined
        ? sessionRequestHandler
          ? false
          : defaultShowQrModal
        : wcOptions.showQrModal,
  });

  provider.events.setMaxListeners(Number.POSITIVE_INFINITY);

  // disconnect the provider if chains are stale when (if not auto connecting)
  if (!isAutoConnect) {
    // const isStale = await isChainsStale(provider, chainsToRequest);

    if (provider.session) {
      await provider.disconnect();
    }
  }

  if (walletId !== "walletConnect") {
    async function handleSessionRequest() {
      const walletLinkToOpen =
        provider.session?.peer?.metadata?.redirect?.native ||
        walletInfo.mobile.native ||
        walletInfo.mobile.universal;

      if (sessionRequestHandler && walletLinkToOpen) {
        // TODO: propagate error when this fails
        await sessionRequestHandler(walletLinkToOpen);
      }
    }

    provider.signer.client.on("session_request_sent", handleSessionRequest);
    provider.events.addListener("disconnect", () => {
      provider.signer.client.off("session_request_sent", handleSessionRequest);
    });
  }

  return provider;
}

function createAccount({
  provider,
  address,
  client,
}: {
  provider: WCProvider;
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
        walletType: "walletConnect",
      });

      return {
        transactionHash,
      };
    },
    async signMessage({ message }) {
      const messageToSign = (() => {
        if (typeof message === "string") {
          return stringToHex(message);
        }
        if (message.raw instanceof Uint8Array) {
          return uint8ArrayToHex(message.raw);
        }
        return message.raw;
      })();
      return provider.request({
        method: "personal_sign",
        params: [messageToSign, this.address],
      });
    },
    async signTypedData(_data) {
      const data = parseTypedData(_data);
      const { domain, message, primaryType } =
        data as unknown as SignTypedDataParameters;

      const types = {
        EIP712Domain: getTypesForEIP712Domain({ domain }),
        ...data.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      validateTypedData({ domain, message, primaryType, types });

      const typedData = serializeTypedData({
        domain: domain ?? {},
        message,
        primaryType,
        types,
      });

      return await provider.request({
        method: "eth_signTypedData_v4",
        params: [this.address, typedData],
      });
    },
  };

  return account;
}

function onConnect(
  address: string,
  chain: Chain,
  provider: WCProvider,
  emitter: WalletEmitter<WCSupportedWalletIds>,
  storage: AsyncStorage,
  client: ThirdwebClient,
): [Account, Chain, DisconnectFn, SwitchChainFn] {
  const account = createAccount({ address, client, provider });

  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    await provider.disconnect();
  }

  function onDisconnect() {
    setRequestedChainsIds([], storage);
    storage?.removeItem(storageKeys.lastUsedChainId);
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
    storage?.setItem(storageKeys.lastUsedChainId, String(newChainId));
  }

  provider.on("accountsChanged", onAccountsChanged);
  provider.on("chainChanged", onChainChanged);
  provider.on("disconnect", onDisconnect);
  provider.on("session_delete", onDisconnect);

  return [
    account,
    chain,
    disconnect,
    (newChain) => switchChainWC(provider, newChain, storage),
  ];
}

// Storage utils  -----------------------------------------------------------------------------------------------

function getNamespaceMethods(provider: WCProvider) {
  return provider.session?.namespaces[NAMESPACE]?.methods || [];
}

function getNamespaceChainsIds(provider: WCProvider): number[] {
  const chainIds = provider.session?.namespaces[NAMESPACE]?.chains?.map(
    (chain) => Number.parseInt(chain.split(":")[1] || ""),
  );

  return chainIds ?? [];
}

async function switchChainWC(
  provider: WCProvider,
  chain: Chain,
  storage: AsyncStorage,
) {
  const chainId = chain.id;
  try {
    const namespaceChains = getNamespaceChainsIds(provider);
    const namespaceMethods = getNamespaceMethods(provider);
    const isChainApproved = namespaceChains.includes(chainId);

    if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
      const apiChain = await getChainMetadata(chain);

      const blockExplorerUrls = [
        ...new Set([
          ...(chain.blockExplorers?.map((x) => x.url) || []),
          ...(apiChain.explorers?.map((x) => x.url) || []),
        ]),
      ];

      await provider.request({
        method: ADD_ETH_CHAIN_METHOD,
        params: [
          {
            blockExplorerUrls:
              blockExplorerUrls.length > 0 ? blockExplorerUrls : undefined,
            chainId: numberToHex(apiChain.chainId),
            chainName: apiChain.name,
            nativeCurrency: apiChain.nativeCurrency, // no clientId on purpose
            rpcUrls: getValidPublicRPCUrl(apiChain),
          },
        ],
      });
      const requestedChains = await getRequestedChainsIds(storage);
      requestedChains.push(chainId);
      setRequestedChainsIds(requestedChains, storage);
    }
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: numberToHex(chainId) }],
    });
  } catch (error) {
    const message =
      typeof error === "string" ? error : (error as ProviderRpcError)?.message;
    if (/user rejected request/i.test(message)) {
      throw new UserRejectedRequestError(error as Error);
    }

    throw new SwitchChainError(error as Error);
  }
}

/**
 * Set the requested chains to the storage.
 * @internal
 */
function setRequestedChainsIds(
  chains: number[] | undefined,
  storage: AsyncStorage,
) {
  storage?.setItem(storageKeys.requestedChains, stringify(chains));
}

/**
 * Get the last requested chains from the storage.
 * @internal
 */
async function getRequestedChainsIds(storage: AsyncStorage): Promise<number[]> {
  const data = await storage.getItem(storageKeys.requestedChains);
  return data ? JSON.parse(data) : [];
}

type ArrayOneOrMore<T> = {
  0: T;
} & Array<T>;

function getChainsToRequest(options: {
  chain?: Chain;
  optionalChains?: Chain[];
  client: ThirdwebClient;
}): {
  rpcMap: Record<number, string>;
  requiredChain: Chain | undefined;
  optionalChains: ArrayOneOrMore<number>;
} {
  const rpcMap: Record<number, string> = {};

  if (options.chain) {
    rpcMap[options.chain.id] = getRpcUrlForChain({
      chain: options.chain,
      client: options.client,
    });
  }

  // limit optional chains to 10
  const optionalChains = (options?.optionalChains || []).slice(0, 10);

  for (const chain of optionalChains) {
    rpcMap[chain.id] = getRpcUrlForChain({
      chain: chain,
      client: options.client,
    });
  }

  if (!options.chain && optionalChains.length === 0) {
    rpcMap[1] = getCachedChain(1).rpc;
  }

  return {
    optionalChains:
      optionalChains.length > 0
        ? (optionalChains.map((x) => x.id) as ArrayOneOrMore<number>)
        : [1],
    requiredChain: options.chain ? options.chain : undefined,
    rpcMap,
  };
}

const chainsToRequestForSafe = [
  1, // Ethereum Mainnet
  11155111, // Sepolia Testnet
  42161, // Arbitrum One Mainnet
  43114, // Avalanche Mainnet
  8453, // Base Mainnet
  1313161554, // Aurora Mainnet
  84532, // Base Sepolia Testnet
  56, // Binance Smart Chain Mainnet
  42220, // Celo Mainnet
  100, // Gnosis Mainnet
  10, // Optimism Mainnet
  137, // Polygon Mainnet
  1101, // Polygon zkEVM Mainnet
  324, // zkSync Era mainnet
  534352, // Scroll mainnet
];
