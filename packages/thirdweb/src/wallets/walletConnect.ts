import {
  getAddress,
  toHex,
  type Hex,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from "viem";
import type { Address } from "abitype";
import { normalizeChainId } from "./utils/normalizeChainId.js";
import { type Wallet } from "./index.js";
import type { DAppMetaData, WalletMetadata } from "./types.js";
import type { ThirdwebClient } from "../index.js";
import { getChainDataForChainId, getRpcUrlForChain } from "../chain/index.js";
import { walletStorage } from "./manager/storage.js";
import type { ApiChain } from "../chain/types.js";
import {
  EthereumProvider,
  OPTIONAL_EVENTS,
  OPTIONAL_METHODS,
} from "@walletconnect/ethereum-provider";

type EthereumProviderOptions = Parameters<(typeof EthereumProvider)["init"]>[0];
type QRCodeModalOptions = Pick<
  NonNullable<EthereumProviderOptions["qrModalOptions"]>,
  | "themeMode"
  | "themeVariables"
  | "desktopWallets"
  | "enableExplorer"
  | "explorerRecommendedWalletIds"
  | "explorerExcludedWalletIds"
  | "mobileWallets"
  | "privacyPolicyUrl"
  | "termsOfServiceUrl"
  | "walletImages"
>;

// TODO: - this is very messy rn - will clean it up later

export const TW_WC_PROJECT_ID = "145769e410f16970a79ff77b2d89a1e0";
export const WC_RELAY_URL = "wss://relay.walletconnect.com";
const NAMESPACE = "eip155";
const REQUESTED_CHAINS_KEY = "wagmi.requestedChains";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";
const LAST_USED_CHAIN_ID = "last-used-chain-id";

export const DEFAULT_DAPP_META: Required<DAppMetaData> = {
  name: "thirdweb powered dApp",
  url: "https://thirdweb.com",
  description: "thirdweb powered dApp",
  logoUrl: "https://thirdweb.com/favicon.ico",
};

const defaultshowQrModal = true;

export type WalletConnectOptions = {
  chainId?: bigint | number | undefined;
  /**
   * Specify to enable silent connection to the wallet or not
   * If set to `true` - wallet will only be connected if the accounts are accessible. If they are not already accessible, wallet will not be connected.
   * If set to `false` - If the accounts are already accessible, wallet will be connected. If they are not already accessible, a connection request will be sent to wallet extension and user will be prompted to connect.
   */
  silent?: boolean | undefined;
  metadata?: WalletMetadata;
  projectId?: string;
  showQrModal?: boolean;
  dappMetadata?: DAppMetaData;
  client: ThirdwebClient;

  qrModalOptions?: QRCodeModalOptions;
  /** If provided, will attempt to connect to an existing pairing. */
  pairingTopic?: string;
};

/**
 * Connect to a wallet using WalletConnect protocol.
 * @param options - The options for connecting wallet
 * @returns A Promise that resolves to a Wallet instance.
 * @throws Error if failed to connect to the wallet.
 * @example
 * ```ts
 * TODO
 * ```
 */
export async function walletConnect(
  options: WalletConnectOptions,
): Promise<Wallet> {
  function getAccount() {
    const { accounts } = provider;
    if (!accounts[0]) {
      throw new Error("No accounts found on provider.");
    }

    return getAddress(accounts[0]);
  }

  function getNamespaceMethods() {
    return provider.session?.namespaces[NAMESPACE]?.methods || [];
  }

  async function getRequestedChainsIds(): Promise<number[]> {
    const data = await walletStorage.get(REQUESTED_CHAINS_KEY);
    return data ? JSON.parse(data) : [];
  }

  function getNamespaceChainsIds() {
    if (!provider) {
      return [];
    }
    const chainIds = provider.session?.namespaces[NAMESPACE]?.chains?.map(
      (chain) => parseInt(chain.split(":")[1] || ""),
    );
    return chainIds ?? [];
  }

  async function isChainsStale() {
    const namespaceMethods = getNamespaceMethods();
    if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
      return false;
    }
    if (!isNewChainsStale) {
      return false;
    }

    const requestedChains = await getRequestedChainsIds();
    const connectorChains = [options.chainId];
    const namespaceChains = getNamespaceChainsIds();

    if (
      namespaceChains.length &&
      !namespaceChains.some((id) => connectorChains.includes(id))
    ) {
      return false;
    }

    return !connectorChains.every((id) => requestedChains.includes(Number(id)));
  }

  async function isAuthorized() {
    try {
      const account = getAccount();

      const isStale = await isChainsStale();

      // If an account does not exist on the session, then the connector is unauthorized.
      if (!account) {
        return false;
      }

      // If the chains are stale on the session, then the connector is unauthorized.
      if (isStale && provider.session) {
        try {
          await provider.disconnect();
        } catch {} // eslint-disable-line no-empty
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  async function setRequestedChainsIds(chains: number[]) {
    walletStorage.set(REQUESTED_CHAINS_KEY, JSON.stringify(chains));
  }

  async function switchChain(chainId: number | bigint) {
    const chainIdNum = Number(chainId);
    try {
      const namespaceChains = getNamespaceChainsIds();
      const namespaceMethods = getNamespaceMethods();
      const isChainApproved = namespaceChains.includes(chainIdNum);

      if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        const chain = await getChainDataForChainId(BigInt(chainId));
        const firstExplorer = chain.explorers && chain.explorers[0];
        const blockExplorerUrls = firstExplorer
          ? { blockExplorerUrls: [firstExplorer.url] }
          : {};
        await provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [
            {
              chainId: toHex(chain.chainId),
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: getValidPublicRPCUrl(chain), // no clientId on purpose
              ...blockExplorerUrls,
            },
          ],
        });
        const requestedChains = await getRequestedChainsIds();
        requestedChains.push(chainIdNum);
        await setRequestedChainsIds(requestedChains);
      }
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(chainId) }],
      });
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : (error as ProviderRpcError)?.message;
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error);
      }

      throw new SwitchChainError(error);
    }
  }

  async function onDisconnect() {
    await setRequestedChainsIds([]);
    await walletStorage.remove(LAST_USED_CHAIN_ID);
    // this.emit("disconnect");
  }

  async function onChainChanged(chainId: number | string) {
    await walletStorage.set(LAST_USED_CHAIN_ID, String(chainId));
    // const id = Number(chainId);
    // const unsupported = this.isChainUnsupported(id);
    // this.emit("change", { chain: { id, unsupported } });
  }

  function removeListeners() {
    if (!provider) {
      return;
    }
    // provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    provider.removeListener("session_delete", onDisconnect);
    // provider.removeListener("display_uri", this.onDisplayUri);
    // provider.removeListener("connect", this.onConnect);
  }

  async function setupListeners() {
    if (!provider) {
      return;
    }
    removeListeners();
    // provider.on("accountsChanged", this.onAccountsChanged);
    provider.on("chainChanged", onChainChanged);
    provider.on("disconnect", onDisconnect);
    provider.on("session_delete", onDisconnect);
    // provider.on("display_uri", this.onDisplayUri);
    // provider.on("connect", this.onConnect);
  }

  async function connect() {
    try {
      // if (!options.chainId) {
      // const lastUsedChainIdStr =
      //   await walletStorage.get(LAST_USED_CHAIN_ID);
      // const lastUsedChainId = lastUsedChainIdStr
      //   ? parseInt(lastUsedChainIdStr)
      //   : undefined;

      // if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) {
      //   targetChainId = lastUsedChainId;
      // }

      // else {
      //   targetChainId = this.filteredChains[0]?.chainId;
      // }
      // }

      setupListeners();

      const isStale = await isChainsStale();

      // If there is an active session with stale chains, disconnect the current session.
      if (provider.session && isStale) {
        await provider.disconnect();
      }

      // If there no active session, or the chains are stale, connect.
      if (!provider.session || isStale) {
        // const optionalChains = this.filteredChains
        //   .filter((chain) => chain.chainId !== targetChainId)
        //   .map((optionalChain) => optionalChain.chainId);

        // this.emit("message", { type: "connecting" });

        await provider.connect({
          pairingTopic: options.pairingTopic,
          chains: [targetChainId],
          // optionalChains:
          //   optionalChains.length > 0 ? optionalChains : [targetChainId],
        });

        setRequestedChainsIds([targetChainId]);
      }

      // If session exists and chains are authorized, enable provider for required chain
      const accounts = await provider.enable();
      if (!accounts[0]) {
        throw new Error("No accounts found on provider.");
      }
      // const account = utils.getAddress(accounts[0]);
      // const id = provider.chainId
      // const unsupported = this.isChainUnsupported(id);

      // return {
      //   account,
      //   chain: { id, unsupported },
      //   provider: new providers.Web3Provider(provider),
      // };
    } catch (error: any) {
      if (/user rejected/i.test((error as ProviderRpcError)?.message)) {
        throw new UserRejectedRequestError(error);
      }
      throw error;
    }
  }

  /// ------------------- start -------------------

  const isNewChainsStale = false; // do we need to make this configurable?

  const targetChainId = Number(options.chainId || 1);
  const rpc = getRpcUrlForChain({
    chain: targetChainId,
    client: options.client,
  });

  const provider = await EthereumProvider.init({
    showQrModal:
      options?.showQrModal === undefined
        ? defaultshowQrModal
        : options.showQrModal,
    projectId: options?.projectId || TW_WC_PROJECT_ID,
    optionalMethods: OPTIONAL_METHODS,
    optionalEvents: OPTIONAL_EVENTS,
    chains: [Number(options?.chainId || 1)],
    // optionalChains: [],
    metadata: {
      name: options?.dappMetadata?.name || DEFAULT_DAPP_META.name,
      description:
        options?.dappMetadata?.description || DEFAULT_DAPP_META.description,
      url: options?.dappMetadata?.url || DEFAULT_DAPP_META.url,
      icons: [options?.dappMetadata?.logoUrl || DEFAULT_DAPP_META.logoUrl],
    },
    rpcMap: {
      [targetChainId]: rpc,
    },
    qrModalOptions: options.qrModalOptions,
  });

  let accountAddresses: string[] = [];

  if (options?.silent) {
    // Auto-connect
    if (await isAuthorized()) {
      accountAddresses = provider.accounts;
    }

    const connectedChainId = provider.chainId;
    if (connectedChainId !== targetChainId) {
      await switchChain(targetChainId);
    }
  }

  // Connect
  else {
    await connect();
    accountAddresses = provider.accounts;
  }

  if (accountAddresses.length === 0) {
    throw new Error("no accounts available");
  }

  // use the first account
  const address = getAddress(accountAddresses[0] as string);

  // get the chainId the provider is on
  const providerChainId = normalizeChainId(provider.chainId);

  // if we want a specific chainId and it is not the same as the provider chainId, trigger switchChain
  if (options?.chainId && options.chainId !== providerChainId) {
    await switchChain(options.chainId);
  }

  const wallet: Wallet = {
    address: address,
    chainId: providerChainId,
    metadata: options?.metadata || {
      name: "WalletConnect",
      iconUrl:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMxQzdERkMiLz4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xXzQ2KSIvPgo8cGF0aCBkPSJNMjYuNDIyNyAzMS40NzMxQzMzLjkxNzEgMjQuMTc1NiA0Ni4wODI5IDI0LjE3NTYgNTMuNTc3MyAzMS40NzMxTDU0LjQ3OTYgMzIuMzU4QzU0Ljg1OCAzMi43MjA3IDU0Ljg1OCAzMy4zMTU1IDU0LjQ3OTYgMzMuNjc4Mkw1MS4zOTQ1IDM2LjY4MTNDNTEuMjA1MyAzNi44Njk5IDUwLjg5OTcgMzYuODY5OSA1MC43MTA1IDM2LjY4MTNMNDkuNDczNiAzNS40NzcyQzQ0LjIzNDcgMzAuMzg1IDM1Ljc2NTMgMzAuMzg1IDMwLjUyNjQgMzUuNDc3MkwyOS4yMDIxIDM2Ljc2ODRDMjkuMDEzIDM2Ljk1NyAyOC43MDc0IDM2Ljk1NyAyOC41MTgyIDM2Ljc2ODRMMjUuNDMzMSAzMy43NjUzQzI1LjA1NDcgMzMuNDAyNiAyNS4wNTQ3IDMyLjgwNzggMjUuNDMzMSAzMi40NDUxTDI2LjQyMjcgMzEuNDczMVpNNTkuOTY1OCAzNy42ODI0TDYyLjcxNjIgNDAuMzUxOEM2My4wOTQ2IDQwLjcxNDUgNjMuMDk0NiA0MS4zMDkzIDYyLjcxNjIgNDEuNjcyTDUwLjMzMjIgNTMuNzI4QzQ5Ljk1MzggNTQuMDkwNyA0OS4zNDI2IDU0LjA5MDcgNDguOTc4OCA1My43MjhMNDAuMTg5MiA0NS4xNjg0QzQwLjEwMTkgNDUuMDgxMyAzOS45NDE4IDQ1LjA4MTMgMzkuODU0NSA0NS4xNjg0TDMxLjA2NDkgNTMuNzI4QzMwLjY4NjUgNTQuMDkwNyAzMC4wNzUzIDU0LjA5MDcgMjkuNzExNSA1My43MjhMMTcuMjgzOCA0MS42NzJDMTYuOTA1NCA0MS4zMDkzIDE2LjkwNTQgNDAuNzE0NSAxNy4yODM4IDQwLjM1MThMMjAuMDM0MiAzNy42ODI0QzIwLjQxMjUgMzcuMzE5NyAyMS4wMjM3IDM3LjMxOTcgMjEuMzg3NSAzNy42ODI0TDMwLjE3NzIgNDYuMjQyQzMwLjI2NDUgNDYuMzI5IDMwLjQyNDUgNDYuMzI5IDMwLjUxMTkgNDYuMjQyTDM5LjMwMTUgMzcuNjgyNEMzOS42Nzk5IDM3LjMxOTcgNDAuMjkxIDM3LjMxOTcgNDAuNjU0OSAzNy42ODI0TDQ5LjQ0NDUgNDYuMjQyQzQ5LjUzMTggNDYuMzI5IDQ5LjY5MTkgNDYuMzI5IDQ5Ljc3OTIgNDYuMjQyTDU4LjU2ODggMzcuNjgyNEM1OC45NzYzIDM3LjMxOTcgNTkuNTg3NSAzNy4zMTk3IDU5Ljk2NTggMzcuNjgyNFoiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMV80NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDI0Nzk1NSA0MC4wMDEyKSBzY2FsZSg4MCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNUQ5REY2Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwNkZGRiIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      id: "walletconnect",
    },
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

    addListener: (event, listener) => {
      if (!provider.on) {
        return;
      }

      provider.events.on(event, listener);
    },
    removeListener: (event, listener) => {
      if (!provider.removeListener) {
        return;
      }
      provider.events.on(event, listener);
    },
  };

  if (provider.on) {
    provider.on("accountsChanged", (accounts: string[]) => {
      const _address = accounts[0];
      if (!_address) {
        // TODO figure out a way to handle this, address is not allowed to be undefined
        // @ts-expect-error - address is not allowed to be undefined
        wallet.address = undefined;
      } else {
        wallet.address = getAddress(_address);
      }
    });

    provider.on("chainChanged", (chainId: string) => {
      wallet.chainId = normalizeChainId(chainId);
    });
  }

  return wallet;
}

// TODO - move this to chains/
function getValidPublicRPCUrl(chain: ApiChain) {
  return getValidChainRPCs(chain).map((rpc) => {
    try {
      const url = new URL(rpc);
      // remove client id from url
      if (url.hostname.endsWith(".thirdweb.com")) {
        url.pathname = "";
        url.search = "";
      }
      return url.toString();
    } catch (e) {
      return rpc;
    }
  });
}

// TODO - move this to chains/
function getValidChainRPCs(
  chain: Pick<ApiChain, "rpc" | "chainId">,
  clientId?: string,
  mode: "http" | "ws" = "http",
): string[] {
  const processedRPCs: string[] = [];

  chain.rpc.forEach((rpc) => {
    // exclude RPC if mode mismatch
    if (mode === "http" && !rpc.startsWith("http")) {
      return;
    }

    if (mode === "ws" && !rpc.startsWith("ws")) {
      return;
    }

    // Replace API_KEY placeholder with value
    if (rpc.includes("${THIRDWEB_API_KEY}")) {
      if (clientId) {
        processedRPCs.push(
          rpc.replace("${THIRDWEB_API_KEY}", clientId) +
            (typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                `/?bundleId=${globalThis.APP_BUNDLE_ID}`
              : ""),
        );
      } else {
        // if no client id, let it through with empty string
        // if secretKey is present, it will be used in header
        // if none are passed, will have reduced access
        processedRPCs.push(rpc.replace("${THIRDWEB_API_KEY}", ""));
      }
    }

    // exclude RPCs with unknown placeholder
    else if (rpc.includes("${")) {
      return;
    }

    // add as is
    else {
      processedRPCs.push(rpc);
    }
  });

  if (processedRPCs.length === 0) {
    throw new Error(
      `No RPC available for chainId "${chain.chainId}" with mode ${mode}`,
    );
  }

  return processedRPCs;
}
