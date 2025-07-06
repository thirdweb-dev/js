import type { UniversalProvider } from "@walletconnect/universal-provider";
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
import { getCachedChain, getRpcUrlForChain } from "../../chains/utils.js";
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
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { WalletEmitter } from "../wallet-emitter.js";
import type { WalletId } from "../wallet-types.js";
import { DEFAULT_PROJECT_ID, NAMESPACE } from "./constants.js";
import type { WCAutoConnectOptions, WCConnectOptions } from "./types.js";

type WCProvider = InstanceType<typeof UniversalProvider>;

let cachedProvider: WCProvider | null = null;

type SavedConnectParams = {
  optionalChains?: Chain[];
  chain?: Chain;
  pairingTopic?: string;
};

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

  // For UniversalProvider, we still need chain configuration for session management
  const { chains: chainsToRequest, rpcMap } = getChainsToRequest({
    chain: chainToRequest,
    client: options.client,
    optionalChains: optionalChains,
  });

  if (!provider.session) {
    // For UniversalProvider, we need to connect with namespaces
    await provider.connect({
      ...(wcOptions?.pairingTopic
        ? { pairingTopic: wcOptions?.pairingTopic }
        : {}),
      namespaces: {
        [NAMESPACE]: {
          chains: chainsToRequest,
          events: ["chainChanged", "accountsChanged"],
          methods: [
            "eth_sendTransaction",
            "eth_signTransaction",
            "eth_sign",
            "personal_sign",
            "eth_signTypedData",
            "wallet_switchEthereumChain",
            "wallet_addEthereumChain",
          ],
          rpcMap,
        },
      },
    });
  }

  setRequestedChainsIds(
    chainsToRequest.map((x) => Number(x.split(":")[1])),
    storage,
  );
  const currentChainId = chainsToRequest[0]?.split(":")[1] || 1;
  const providerChainId = normalizeChainId(currentChainId);
  const accounts: string[] = await provider.request(
    {
      method: "eth_requestAccounts",
      params: [],
    },
    `eip155:${providerChainId}`,
  );
  const address = accounts[0];
  if (!address) {
    throw new Error("No accounts found on provider.");
  }

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
  );

  // For UniversalProvider, get accounts from enable() method
  const addresses = await provider.enable();
  const address = addresses[0];

  if (!address) {
    throw new Error("No accounts found on provider.");
  }

  // For UniversalProvider, get chainId from the session namespaces or use default
  const currentChainId = options.chain?.id || 1;
  const providerChainId = normalizeChainId(currentChainId);

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
) {
  if (cachedProvider) {
    return cachedProvider;
  }

  const walletInfo = await getWalletInfo(walletId);
  const wcOptions = options.walletConnect;
  const { UniversalProvider } = await import(
    "@walletconnect/universal-provider"
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

  const provider = await UniversalProvider.init({
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
    projectId: wcOptions?.projectId || DEFAULT_PROJECT_ID,
  });

  provider.events.setMaxListeners(Number.POSITIVE_INFINITY);

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

    // For UniversalProvider, use different event handling
    provider.on("session_request_sent", handleSessionRequest);
    provider.events.addListener("disconnect", () => {
      provider.off("session_request_sent", handleSessionRequest);
      cachedProvider = null;
    });
  }

  cachedProvider = provider;

  return provider;
}

function createAccount({
  provider,
  address,
  client,
  chain,
}: {
  provider: WCProvider;
  address: string;
  client: ThirdwebClient;
  chain: Chain;
}) {
  const account: Account = {
    address: getAddress(address),
    async sendTransaction(tx: SendTransactionOption) {
      const transactionHash = (await provider.request(
        {
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
        },
        `eip155:${tx.chainId}`,
      )) as Hex;

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
      return provider.request(
        {
          method: "personal_sign",
          params: [messageToSign, this.address],
        },
        `eip155:${chain.id}`,
      );
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

      return await provider.request(
        {
          method: "eth_signTypedData_v4",
          params: [this.address, typedData],
        },
        `eip155:${chain.id}`,
      );
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
  const account = createAccount({ address, chain, client, provider });

  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    await provider.disconnect();
    cachedProvider = null;
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
        chain,
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
    (newChain) => switchChainWC(provider, newChain),
  ];
}

async function switchChainWC(provider: WCProvider, chain: Chain) {
  const chainId = chain.id;
  try {
    provider.setDefaultChain(`eip155:${chainId}`);
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

function getChainsToRequest(options: {
  chain?: Chain;
  optionalChains?: Chain[];
  client: ThirdwebClient;
}): {
  rpcMap: Record<number, string>;
  chains: string[];
} {
  const rpcMap: Record<number, string> = {};
  const chainIds: number[] = [];

  if (options.chain) {
    rpcMap[options.chain.id] = getRpcUrlForChain({
      chain: options.chain,
      client: options.client,
    });
    chainIds.push(options.chain.id);
  }

  // limit optional chains to 10
  const optionalChains = (options?.optionalChains || []).slice(0, 10);

  for (const chain of optionalChains) {
    rpcMap[chain.id] = getRpcUrlForChain({
      chain: chain,
      client: options.client,
    });
    chainIds.push(chain.id);
  }

  if (!options.chain && optionalChains.length === 0) {
    rpcMap[1] = getCachedChain(1).rpc;
    chainIds.push(1);
  }

  return {
    chains: chainIds.map((x) => `eip155:${x}`),
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
