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
import type { Account, SendTransactionOption } from "../interfaces/wallet.js";
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
import type { WCSupportedWalletIds } from "../__generated__/wallet-ids.js";
import type { DisconnectFn, SwitchChainFn } from "../types.js";
import type { WalletEmitter } from "../wallet-emitter.js";
import { isAndroid, isIOS, isMobile } from "../../utils/web/isMobile.js";
import { openWindow } from "../../utils/web/openWindow.js";
import { getWalletInfo } from "../__generated__/getWalletInfo.js";

type WCProvider = InstanceType<typeof EthereumProvider>;

const defaultWCProjectId = "08c4b07e3ad25f1a27c14a4e8cecb6f0";

const NAMESPACE = "eip155";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";

// const isNewChainsStale = true;
const defaultShowQrModal = true;

/**
 * @internal
 */
export async function connectWC(
  options: WCConnectOptions,
  emitter: WalletEmitter<WCSupportedWalletIds>,
  walletId: WCSupportedWalletIds,
): Promise<ReturnType<typeof onConnect>> {
  const provider = await initProvider(options, walletId);
  const wcOptions = options.walletConnect;

  const targetChain = options?.chain || ethereum;
  const targetChainId = targetChain.id;

  const rpc = getRpcUrlForChain({
    chain: targetChain,
    client: options.client,
  });

  const { onDisplayUri } = wcOptions || {};

  if (onDisplayUri) {
    if (onDisplayUri) {
      provider.events.addListener("display_uri", onDisplayUri);
    }
  }

  // If there no active session, or the chain is stale, force connect.
  if (!provider.session) {
    await provider.connect({
      pairingTopic: wcOptions?.pairingTopic,
      chains: [Number(targetChainId)],
      rpcMap: {
        [targetChainId.toString()]: rpc,
      },
    });
  }

  // If session exists and chains are authorized, enable provider for required chain
  const addresses = await provider.enable();
  const address = addresses[0];
  if (!address) {
    throw new Error("No accounts found on provider.");
  }

  const chain = defineChain(normalizeChainId(provider.chainId));

  if (wcOptions?.onDisplayUri) {
    provider.events.removeListener("display_uri", wcOptions.onDisplayUri);
  }

  return onConnect(address, chain, provider, emitter);
}

/**
 * Auto connect to already connected wallet connect session.
 * @internal
 */
export async function autoConnectWC(
  options: WCAutoConnectOptions,
  emitter: WalletEmitter<WCSupportedWalletIds>,
  walletId: WCSupportedWalletIds,
): Promise<ReturnType<typeof onConnect>> {
  const provider = await initProvider(
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
    walletId,
  );

  const address = provider.accounts[0];

  if (!address) {
    throw new Error("No accounts found on provider.");
  }

  const chain = defineChain(normalizeChainId(provider.chainId));

  return onConnect(address, chain, provider, emitter);
}

// /**
//  * @internal
//  */
// export async function disconnectWC(wallet: Wallet<WCSupportedWalletIds>) {
//   const provider = walletToProviderMap.get(wallet);
//   // const storage = getWalletData(wallet)?.storage;

//   onDisconnect(wallet);
//   // if (storage) {
//   //   deleteConnectParamsFromStorage(storage, wallet.id);
//   // }

//   if (provider) {
//     provider.disconnect();
//   }
// }

// Connection utils -----------------------------------------------------------------------------------------------

async function initProvider(
  options: WCConnectOptions,
  walletId: WCSupportedWalletIds,
) {
  const walletInfo = await getWalletInfo(walletId);
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

  function handleSessionRequest() {
    if (typeof window === "undefined") {
      return;
    }

    if (!isMobile()) {
      return;
    }

    const preferUniversal =
      walletInfo.mobile.universal || walletInfo.mobile.native || "";
    const preferNative =
      walletInfo.mobile.native || walletInfo.mobile.universal || "";

    if (isAndroid()) {
      openWindow(preferUniversal);
    } else if (isIOS()) {
      openWindow(preferNative);
    } else {
      openWindow(preferUniversal);
    }
  }

  provider.signer.client.on("session_request_sent", handleSessionRequest);
  provider.events.addListener("disconnect", () => {
    provider.signer.client.off("session_request_sent", handleSessionRequest);
  });

  provider.events.setMaxListeners(Infinity);

  return provider;
}

function onConnect(
  address: string,
  chain: Chain,
  provider: WCProvider,
  emitter: WalletEmitter<WCSupportedWalletIds>,
): [Account, Chain, DisconnectFn, SwitchChainFn] {
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

  function disconnect() {
    if (!provider) {
      return;
    }
    provider.disconnect();
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
  }

  function onDisconnect() {
    disconnect();
    emitter.emit("disconnect", undefined);
  }

  function onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      onDisconnect();
    } else {
      emitter.emit("accountsChanged", accounts);
    }
  }

  function onChainChanged(newChainId: string) {
    const newChain = defineChain(normalizeChainId(newChainId));
    emitter.emit("chainChanged", newChain);
  }

  provider.on("accountsChanged", onAccountsChanged);
  provider.on("chainChanged", onChainChanged);
  provider.on("disconnect", onDisconnect);
  return [
    account,
    chain,
    disconnect,
    (newChain) => switchChainWC(provider, newChain),
  ];
}

// Storage utils  -----------------------------------------------------------------------------------------------

function getNamespaceMethods(provider: WCProvider) {
  return provider.session?.namespaces[NAMESPACE]?.methods || [];
}

function getNamespaceChainsIds(provider: WCProvider): number[] {
  if (!provider) {
    return [];
  }
  const chainIds = provider.session?.namespaces[NAMESPACE]?.chains?.map(
    (chain) => parseInt(chain.split(":")[1] || ""),
  );

  return chainIds ?? [];
}

async function switchChainWC(provider: WCProvider, chain: Chain) {
  const chainId = chain.id;
  try {
    const namespaceChains = getNamespaceChainsIds(provider);
    const namespaceMethods = getNamespaceMethods(provider);
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
      // const requestedChains = await getRequestedChainsIds(wallet);
      // requestedChains.push(chainId);
      // setRequestedChainsIds(wallet, requestedChains);
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
