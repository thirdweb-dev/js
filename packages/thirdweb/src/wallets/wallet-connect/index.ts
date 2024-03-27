import {
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  validateTypedData,
} from "viem";
import type { Address } from "abitype";
import { normalizeChainId } from "../utils/normalizeChainId.js";
// import {
//   deleteConnectParamsFromStorage,
//   // getSavedConnectParamsFromStorage,
//   // saveConnectParamsToStorage,
// } from "../storage/walletStorage.js";

import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type { WCAutoConnectOptions, WCConnectOptions } from "./types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { stringify } from "../../utils/json.js";
import type { EthereumProvider } from "@walletconnect/ethereum-provider";
import {
  defineChain,
  getChainMetadata,
  getRpcUrlForChain,
} from "../../chains/utils.js";
import type { Chain } from "../../chains/types.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import { isHex, numberToHex, type Hex } from "../../utils/encoding/hex.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
// import { getWalletData } from "../interfaces/wallet-data.js";
import type { WCSupportedWalletIds } from "../__generated__/wallet-ids.js";

const defaultWCProjectId = "145769e410f16970a79ff77b2d89a1e0"; // TODO: CHANGE THIS !!!!

const NAMESPACE = "eip155";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";

// const storageKeys = {
//   requestedChains: "tw.wc.requestedChains",
//   lastUsedChainId: "tw.wc.lastUsedChainId",
// };

const isNewChainsStale = true;
const defaultShowQrModal = true;

const walletToProviderMap = new WeakMap<
  Wallet<WCSupportedWalletIds>,
  InstanceType<typeof EthereumProvider>
>();

// type SavedConnectParams = {
//   optionalChains?: Chain[];
//   chain: Chain;
//   pairingTopic?: string;
// };

/**
 * @internal
 */
export async function connectWC(
  wallet: Wallet<WCSupportedWalletIds>,
  options: WCConnectOptions,
): Promise<[Account, Chain]> {
  const provider = await initProvider(wallet, false, options);
  const wcOptions = options.walletConnect;

  const isChainsState = await isChainsStale(wallet, [
    provider.chainId,
    ...(wcOptions?.optionalChains || []).map((c) => c.id),
  ]);

  const targetChain = options?.chain || ethereum;
  const targetChainId = targetChain.id;

  const rpc = getRpcUrlForChain({
    chain: targetChain,
    client: options.client,
  });

  const { onDisplayUri, onSessionRequestSent } = wcOptions || {};

  if (onDisplayUri || onSessionRequestSent) {
    if (onDisplayUri) {
      provider.events.addListener("display_uri", onDisplayUri);
    }

    if (onSessionRequestSent) {
      provider.signer.client.on("session_request_sent", onSessionRequestSent);
      provider.events.addListener("disconnect", () => {
        provider.signer.client.off(
          "session_request_sent",
          onSessionRequestSent,
        );
      });
    }
  }

  // If there no active session, or the chain is state, force connect.
  if (!provider.session || isChainsState) {
    await provider.connect({
      pairingTopic: wcOptions?.pairingTopic,
      chains: [Number(targetChainId)],
      rpcMap: {
        [targetChainId.toString()]: rpc,
      },
    });

    setRequestedChainsIds(wallet, [targetChainId]);
  }

  // If session exists and chains are authorized, enable provider for required chain
  const addresses = await provider.enable();
  const address = addresses[0];
  if (!address) {
    throw new Error("No accounts found on provider.");
  }

  const chain = defineChain(normalizeChainId(provider.chainId));
  // const walletData = getWalletData(wallet);
  // if (walletData) {
  //   walletData.chain = chain;
  // }

  // if (options) {
  //   const savedParams: SavedConnectParams = {
  //     optionalChains: wcOptions?.optionalChains,
  //     chain: chain,
  //     pairingTopic: wcOptions?.pairingTopic,
  //   };

  //   if (walletData?.storage) {
  //     saveConnectParamsToStorage(walletData.storage, wallet.id, savedParams);
  //   }
  // }

  if (wcOptions?.onDisplayUri) {
    provider.events.removeListener("display_uri", wcOptions.onDisplayUri);
  }

  return [onConnect(wallet, address), chain] as const;
}

/**
 * Auto connect to already connected wallet connect session.
 * @internal
 */
export async function autoConnectWC(
  wallet: Wallet<WCSupportedWalletIds>,
  options: WCAutoConnectOptions,
): Promise<[Account, Chain]> {
  const provider = await initProvider(
    wallet,
    true,
    options.savedConnectParams
      ? {
          chain: options.savedConnectParams.chain,
          client: options.client,
          walletConnect: {
            pairingTopic: options.savedConnectParams.pairingTopic,
            optionalChains: options.savedConnectParams.optionalChains,
          },
        }
      : {
          client: options.client,
          walletConnect: {},
        },
  );

  const address = provider.accounts[0];

  if (!address) {
    throw new Error("No accounts found on provider.");
  }

  return [
    onConnect(wallet, address),
    defineChain(normalizeChainId(provider.chainId)),
  ] as const;
}

/**
 * @internal
 */
export async function switchChainWC(
  wallet: Wallet<WCSupportedWalletIds>,
  chain: Chain,
) {
  const provider = assertProvider(wallet);

  const chainId = chain.id;
  try {
    const namespaceChains = getNamespaceChainsIds(wallet);
    const namespaceMethods = getNamespaceMethods(wallet);
    const isChainApproved = namespaceChains.includes(chainId);

    if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
      const apiChain = await getChainMetadata(chain);
      const firstExplorer = apiChain.explorers && apiChain.explorers[0];
      const blockExplorerUrls = firstExplorer
        ? { blockExplorerUrls: [firstExplorer.url] }
        : {};
      await provider.request({
        method: ADD_ETH_CHAIN_METHOD,
        params: [
          {
            chainId: numberToHex(apiChain.chainId),
            chainName: apiChain.name,
            nativeCurrency: apiChain.nativeCurrency,
            rpcUrls: getValidPublicRPCUrl(apiChain), // no clientId on purpose
            ...blockExplorerUrls,
          },
        ],
      });
      const requestedChains = await getRequestedChainsIds(wallet);
      requestedChains.push(chainId);
      setRequestedChainsIds(wallet, requestedChains);
    }
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: numberToHex(chainId) }],
    });
  } catch (error: any) {
    const message =
      typeof error === "string" ? error : (error as ProviderRpcError)?.message;
    if (/user rejected request/i.test(message)) {
      throw new UserRejectedRequestError(error);
    }

    throw new SwitchChainError(error);
  }
}

/**
 * @internal
 */
export async function disconnectWC(wallet: Wallet<WCSupportedWalletIds>) {
  const provider = walletToProviderMap.get(wallet);
  // const storage = getWalletData(wallet)?.storage;

  onDisconnect(wallet);
  // if (storage) {
  //   deleteConnectParamsFromStorage(storage, wallet.id);
  // }

  if (provider) {
    provider.disconnect();
  }
}

// Connection utils -----------------------------------------------------------------------------------------------

async function initProvider(
  wallet: Wallet<WCSupportedWalletIds>,
  isAutoConnect: boolean,
  options: WCConnectOptions,
) {
  const wcOptions = options.walletConnect;
  const { EthereumProvider, OPTIONAL_EVENTS, OPTIONAL_METHODS } = await import(
    "@walletconnect/ethereum-provider"
  );

  const targetChain = options.chain || ethereum;

  const rpc = getRpcUrlForChain({
    chain: targetChain,
    client: options.client,
  });

  const provider = await EthereumProvider.init({
    showQrModal:
      wcOptions?.showQrModal === undefined
        ? defaultShowQrModal
        : wcOptions.showQrModal,
    projectId: wcOptions?.projectId || defaultWCProjectId,
    optionalMethods: OPTIONAL_METHODS,
    optionalEvents: OPTIONAL_EVENTS,
    optionalChains: [targetChain.id],
    metadata: {
      name: wcOptions?.appMetadata?.name || getDefaultAppMetadata().name,
      description:
        wcOptions?.appMetadata?.description ||
        getDefaultAppMetadata().description,
      url: wcOptions?.appMetadata?.url || getDefaultAppMetadata().url,
      icons: [
        wcOptions?.appMetadata?.logoUrl || getDefaultAppMetadata().logoUrl,
      ],
    },
    rpcMap: {
      [targetChain.id]: rpc,
    },
    qrModalOptions: wcOptions?.qrModalOptions,
    disableProviderPing: true,
  });

  provider.events.setMaxListeners(Infinity);
  walletToProviderMap.set(wallet, provider);

  if (!isAutoConnect) {
    const chains = [targetChain, ...(wcOptions?.optionalChains || [])];

    const isStale = await isChainsStale(
      wallet,
      chains.map((c) => c.id),
    );
    if (isStale && provider.session) {
      await provider.disconnect();
    }
  }
  // const walletData = getWalletData(wallet);

  // if (walletData) {
  //   // setup listeners
  //   provider.on("disconnect", walletData.onDisconnect);
  //   provider.on("session_delete", walletData.onDisconnect);

  //   // TODO: check which type of chain id actually comes from wallet connect
  //   const onChainChanged = (chainId: number | string) => {
  //     walletData.storage?.setItem(storageKeys.lastUsedChainId, String(chainId));
  //     walletData.onChainChanged(String(chainId));
  //   };

  //   provider.on("chainChanged", onChainChanged);
  // }

  // try switching to correct chain
  if (options?.chain && provider.chainId !== options?.chain.id) {
    try {
      await switchChainWC(wallet, options.chain);
    } catch (e) {
      console.error("Failed to Switch chain to target chain");
      console.error(e);
      if (!isAutoConnect) {
        throw e;
      }
    }
  }

  wallet.events = {
    addListener(event, listener) {
      provider.events.on(event, listener);
    },
    removeListener(event, listener) {
      provider.events.removeListener(event, listener);
    },
  };

  return provider;
}

function assertProvider(wallet: Wallet<WCSupportedWalletIds>) {
  const provider = walletToProviderMap.get(wallet);
  if (!provider) {
    throw new Error("Provider not initialized");
  }
  return provider;
}

function onConnect(
  wallet: Wallet<WCSupportedWalletIds>,
  address: string,
): Account {
  const provider = assertProvider(wallet);

  const account: Account = {
    address,
    async sendTransaction(tx: SendTransactionOption) {
      const transactionHash = (await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            gas: tx.gas ? numberToHex(tx.gas) : undefined,
            value: tx.value ? numberToHex(tx.value) : undefined,
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
      return provider.request({
        method: "personal_sign",
        params: [message, this.address],
      });
    },
    async signTypedData(data) {
      const { domain, message, primaryType } =
        data as unknown as SignTypedDataParameters;

      const types = {
        EIP712Domain: getTypesForEIP712Domain({ domain }),
        ...data.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      validateTypedData({ domain, message, primaryType, types });

      const typedData = stringify(
        { domain: domain ?? {}, message, primaryType, types },
        (_, value) => (isHex(value) ? value.toLowerCase() : value),
      );

      return await provider.request({
        method: "eth_signTypedData_v4",
        params: [this.address, typedData],
      });
    },
  };

  return account;
}

function onDisconnect(wallet: Wallet<WCSupportedWalletIds>) {
  setRequestedChainsIds(wallet, []);
  // const walletData = getWalletData(wallet);

  // if (walletData) {
  //   walletData.storage?.removeItem(storageKeys.lastUsedChainId);

  //   const provider = walletToProviderMap.get(wallet);

  //   if (provider) {
  //     provider.removeListener("chainChanged", walletData.onChainChanged);
  //     provider.removeListener("disconnect", walletData.onDisconnect);
  //     provider.removeListener("session_delete", walletData.onDisconnect);
  //   }

  //   walletData.account = undefined;
  //   walletData.chain = undefined;
  // }
}

// Storage utils  -----------------------------------------------------------------------------------------------

/**
 * if every chain requested were already requested earlier - then they are not stale
 * @param connectToChainId
 * @internal
 */
async function isChainsStale(
  wallet: Wallet<WCSupportedWalletIds>,
  chains: number[],
) {
  const namespaceMethods = getNamespaceMethods(wallet);

  // if chain adding method is available, then chains are not stale
  if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
    return false;
  }

  // if new chains are considered stale, then return true
  if (!isNewChainsStale) {
    return false;
  }

  const requestedChains = await getRequestedChainsIds(wallet);
  const namespaceChains = getNamespaceChainsIds(wallet);

  // if any of the requested chains are not in the namespace chains, then they are stale
  if (
    namespaceChains.length &&
    !namespaceChains.some((id) => chains.includes(id))
  ) {
    return false;
  }

  // if chain was requested earlier, then they are not stale
  return !chains.every((id) => requestedChains.includes(id));
}

function getNamespaceMethods(wallet: Wallet<WCSupportedWalletIds>) {
  const provider = assertProvider(wallet);
  return provider.session?.namespaces[NAMESPACE]?.methods || [];
}

/**
 * Set the requested chains to the storage.
 * @internal
 */
function setRequestedChainsIds(
  // @ts-expect-error - fix later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wallet: Wallet<WCSupportedWalletIds>,
  // @ts-expect-error - fix later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chains: number[],
) {
  // getWalletData(wallet)?.storage?.setItem(
  //   storageKeys.requestedChains,
  //   JSON.stringify(chains),
  // );
}

/**
 * Get the last requested chains from the storage.
 * @internal
 */
async function getRequestedChainsIds(
  // @ts-expect-error - fix later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wallet: Wallet<WCSupportedWalletIds>,
): Promise<number[]> {
  // const storage = getWalletData(wallet)?.storage;
  // if (!storage) {
  //   return [];
  // }
  // const data = await storage.getItem(storageKeys.requestedChains);
  // return data ? JSON.parse(data) : [];
  return [];
}

/**
 * Get the chainIds from the wallet connect session.
 * @internal
 */
function getNamespaceChainsIds(wallet: Wallet<WCSupportedWalletIds>): number[] {
  const provider = walletToProviderMap.get(wallet);

  if (!provider) {
    return [];
  }
  const chainIds = provider.session?.namespaces[NAMESPACE]?.chains?.map(
    (chain) => parseInt(chain.split(":")[1] || ""),
  );

  return chainIds ?? [];
}
