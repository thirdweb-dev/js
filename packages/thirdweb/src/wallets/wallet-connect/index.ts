import {
  toHex,
  type Hex,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from "viem";
import type { Address } from "abitype";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { DAppMetaData } from "../types.js";
import {
  deleteConnectParamsFromStorage,
  getSavedConnectParamsFromStorage,
  saveConnectParamsToStorage,
  walletStorage,
} from "../manager/storage.js";
import {
  EthereumProvider,
  OPTIONAL_EVENTS,
  OPTIONAL_METHODS,
} from "@walletconnect/ethereum-provider";
import {
  getChainDataForChainId,
  getRpcUrlForChain,
} from "../../chain/index.js";
import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type {
  WalletConnectConnectionOptions,
  WalletConnectCreationOptions,
} from "./types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";

export const defaultWCProjectId = "145769e410f16970a79ff77b2d89a1e0";
export const defaultWCRelayUrl = "wss://relay.walletconnect.com";
export const defaultDappMetadata: Required<DAppMetaData> = {
  name: "thirdweb powered dApp",
  url: "https://thirdweb.com",
  description: "thirdweb powered dApp",
  logoUrl: "https://thirdweb.com/favicon.ico",
};

const NAMESPACE = "eip155";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";

const storageKeys = {
  requestedChains: "tw.wc.requestedChains",
  lastUsedChainId: "tw.wc.lastUsedChainId",
};

const isNewChainsStale = false; // do we need to make this configurable?
const defaultShowQrModal = true;
const defaultChainId = 1;

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
export function walletConnect(options: WalletConnectCreationOptions) {
  return new WalletConnect(options);
}

/**
 * Class to connect to a wallet using WalletConnect protocol.
 */
export class WalletConnect implements Wallet {
  #options: WalletConnectCreationOptions;
  #provider: InstanceType<typeof EthereumProvider> | undefined;

  chainId: Wallet["chainId"];
  events: Wallet["events"];
  metadata: Wallet["metadata"];

  /**
   * Create a new WalletConnect instance to connect to a wallet using WalletConnect protocol.
   * @param options - Options for connecting to the wallet.
   * @example
   * ```ts
   * // creating a wallet instance with minimal options required
   * const wallet = new WalletConnect({
   *  client,
   * });
   * ```
   */
  constructor(options: WalletConnectCreationOptions) {
    this.#options = options;
    this.metadata = options?.metadata || {
      name: "WalletConnect",
      iconUrl:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMxQzdERkMiLz4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xXzQ2KSIvPgo8cGF0aCBkPSJNMjYuNDIyNyAzMS40NzMxQzMzLjkxNzEgMjQuMTc1NiA0Ni4wODI5IDI0LjE3NTYgNTMuNTc3MyAzMS40NzMxTDU0LjQ3OTYgMzIuMzU4QzU0Ljg1OCAzMi43MjA3IDU0Ljg1OCAzMy4zMTU1IDU0LjQ3OTYgMzMuNjc4Mkw1MS4zOTQ1IDM2LjY4MTNDNTEuMjA1MyAzNi44Njk5IDUwLjg5OTcgMzYuODY5OSA1MC43MTA1IDM2LjY4MTNMNDkuNDczNiAzNS40NzcyQzQ0LjIzNDcgMzAuMzg1IDM1Ljc2NTMgMzAuMzg1IDMwLjUyNjQgMzUuNDc3MkwyOS4yMDIxIDM2Ljc2ODRDMjkuMDEzIDM2Ljk1NyAyOC43MDc0IDM2Ljk1NyAyOC41MTgyIDM2Ljc2ODRMMjUuNDMzMSAzMy43NjUzQzI1LjA1NDcgMzMuNDAyNiAyNS4wNTQ3IDMyLjgwNzggMjUuNDMzMSAzMi40NDUxTDI2LjQyMjcgMzEuNDczMVpNNTkuOTY1OCAzNy42ODI0TDYyLjcxNjIgNDAuMzUxOEM2My4wOTQ2IDQwLjcxNDUgNjMuMDk0NiA0MS4zMDkzIDYyLjcxNjIgNDEuNjcyTDUwLjMzMjIgNTMuNzI4QzQ5Ljk1MzggNTQuMDkwNyA0OS4zNDI2IDU0LjA5MDcgNDguOTc4OCA1My43MjhMNDAuMTg5MiA0NS4xNjg0QzQwLjEwMTkgNDUuMDgxMyAzOS45NDE4IDQ1LjA4MTMgMzkuODU0NSA0NS4xNjg0TDMxLjA2NDkgNTMuNzI4QzMwLjY4NjUgNTQuMDkwNyAzMC4wNzUzIDU0LjA5MDcgMjkuNzExNSA1My43MjhMMTcuMjgzOCA0MS42NzJDMTYuOTA1NCA0MS4zMDkzIDE2LjkwNTQgNDAuNzE0NSAxNy4yODM4IDQwLjM1MThMMjAuMDM0MiAzNy42ODI0QzIwLjQxMjUgMzcuMzE5NyAyMS4wMjM3IDM3LjMxOTcgMjEuMzg3NSAzNy42ODI0TDMwLjE3NzIgNDYuMjQyQzMwLjI2NDUgNDYuMzI5IDMwLjQyNDUgNDYuMzI5IDMwLjUxMTkgNDYuMjQyTDM5LjMwMTUgMzcuNjgyNEMzOS42Nzk5IDM3LjMxOTcgNDAuMjkxIDM3LjMxOTcgNDAuNjU0OSAzNy42ODI0TDQ5LjQ0NDUgNDYuMjQyQzQ5LjUzMTggNDYuMzI5IDQ5LjY5MTkgNDYuMzI5IDQ5Ljc3OTIgNDYuMjQyTDU4LjU2ODggMzcuNjgyNEM1OC45NzYzIDM3LjMxOTcgNTkuNTg3NSAzNy4zMTk3IDU5Ljk2NTggMzcuNjgyNFoiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMV80NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDI0Nzk1NSA0MC4wMDEyKSBzY2FsZSg4MCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNUQ5REY2Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwNkZGRiIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
      id: "walletconnect",
    };
  }

  /**
   * Auto connect to already connected wallet connect session.
   * @example
   * ```ts
   * await wallet.autoConnect();
   * ```
   * @returns A Promise that resolves to the connected wallet address.
   */
  async autoConnect(): Promise<Account> {
    const savedOptions = await getSavedConnectParamsFromStorage(
      this.metadata.id,
    );

    const provider = await this.#initProvider(true, savedOptions || undefined);

    const address = provider.accounts[0];

    if (!address) {
      throw new Error("No accounts found on provider.");
    }

    this.chainId = normalizeChainId(provider.chainId);

    return this.#onConnect(address);
  }

  /**
   * @internal
   */
  #onConnect(address: string): Account {
    const wallet = this;
    return {
      wallet,
      address,
      async sendTransaction(tx: SendTransactionOption) {
        const provider = wallet.#assertProvider();

        if (!wallet.chainId || !this.address) {
          throw new Error("Invalid chainId or address");
        }

        if (normalizeChainId(tx.chainId) !== wallet.chainId) {
          await wallet.switchChain(tx.chainId);
        }

        const transactionHash = (await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              gas: tx.gas ? toHex(tx.gas) : undefined,
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
    };
  }

  /**
   * Connect to a wallet using WalletConnect protocol.
   * @param options - Options for connecting the wallet.
   * @example
   * ```ts
   * await wallet.connect();
   * ```
   * @returns A Promise that resolves to the connected wallet address.
   */
  async connect(options?: WalletConnectConnectionOptions): Promise<Account> {
    const provider = await this.#initProvider(false, options);
    const isStale = await this.#isChainsStale(provider.chainId);
    const targetChainId = Number(options?.chainId || defaultChainId);

    const rpc = getRpcUrlForChain({
      chain: targetChainId,
      client: this.#options.client,
    });

    const { onDisplayUri, onSessionRequestSent } = options || {};

    if (onDisplayUri || onSessionRequestSent) {
      if (onDisplayUri) {
        provider.events.addListener("display_uri", onDisplayUri);
        provider.events.addListener("disconnect", () => {
          provider.events.removeListener("display_uri", onDisplayUri);
        });
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
    if (!provider.session || isStale) {
      await provider.connect({
        pairingTopic: options?.pairingTopic,
        chains: [targetChainId],
        rpcMap: {
          [targetChainId]: rpc,
        },
      });

      this.#setRequestedChainsIds([targetChainId]);
    }

    // If session exists and chains are authorized, enable provider for required chain
    const addresses = await provider.enable();
    const address = addresses[0];
    if (!address) {
      throw new Error("No accounts found on provider.");
    }

    this.chainId = normalizeChainId(provider.chainId);

    if (options) {
      saveConnectParamsToStorage(this.metadata.id, options);
    }

    return this.#onConnect(address);
  }

  /**
   * Disconnect the wallet and clear the session.
   * @example
   * ```ts
   * await wallet.disconnect();
   * ```
   */
  async disconnect() {
    const provider = this.#provider;
    if (provider) {
      this.#onDisconnect();
      await provider.disconnect();
      deleteConnectParamsFromStorage(this.metadata.id);
    }
  }

  /**
   * Switch the wallet to a blockchain with given chainId.
   * @param chainId - The chainId to switch the wallet to.
   * @example
   * ```ts
   * await wallet.switchChain(1);
   * ```
   */
  async switchChain(chainId: number | bigint) {
    const provider = this.#assertProvider();
    const chainIdNum = Number(chainId);
    try {
      const namespaceChains = this.#getNamespaceChainsIds();
      const namespaceMethods = this.#getNamespaceMethods();
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
        const requestedChains = await this.#getRequestedChainsIds();
        requestedChains.push(chainIdNum);
        this.#setRequestedChainsIds(requestedChains);
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

  /**
   * Initialize the WalletConnect provider.
   * @param switchChainRequired - Whether to switch chain is required or not.
   * @param connectionOptions - Options for connecting to the wallet.
   * @internal
   */
  async #initProvider(
    isAutoConnect: boolean,
    connectionOptions?: WalletConnectConnectionOptions,
  ) {
    const targetChainId = Number(connectionOptions?.chainId || 1);

    const rpc = getRpcUrlForChain({
      chain: targetChainId,
      client: this.#options.client,
    });

    const provider = await EthereumProvider.init({
      showQrModal:
        connectionOptions?.showQrModal === undefined
          ? defaultShowQrModal
          : connectionOptions.showQrModal,
      projectId: this.#options?.projectId || defaultWCProjectId,
      optionalMethods: OPTIONAL_METHODS,
      optionalEvents: OPTIONAL_EVENTS,
      chains: [targetChainId],
      // optionalChains: [],
      metadata: {
        name: this.#options.dappMetadata?.name || defaultDappMetadata.name,
        description:
          this.#options.dappMetadata?.description ||
          defaultDappMetadata.description,
        url: this.#options.dappMetadata?.url || defaultDappMetadata.url,
        icons: [
          this.#options.dappMetadata?.logoUrl || defaultDappMetadata.logoUrl,
        ],
      },
      rpcMap: {
        [targetChainId]: rpc,
      },
      qrModalOptions: connectionOptions?.qrModalOptions,
    });

    this.#provider = provider;

    // const isStale = await this.#isChainsStale(Number(this.chainId));
    // isStale &&
    if (!isAutoConnect) {
      if (provider.session) {
        await provider.disconnect();
      }
    }

    // setup listeners
    provider.on("disconnect", this.#onDisconnect);
    provider.on("session_delete", this.#onDisconnect);
    provider.on("chainChanged", this.#onChainChanged);

    // try switching to correct chain
    if (
      connectionOptions?.chainId &&
      BigInt(provider.chainId) !== BigInt(connectionOptions?.chainId)
    ) {
      try {
        await this.switchChain(connectionOptions.chainId);
      } catch (e) {
        console.error("Failed to Switch chain to target chain");
        console.error(e);
        if (!isAutoConnect) {
          throw e;
        }
      }
    }

    this.events = {
      addListener(event, listener) {
        provider.events.on(event, listener);
      },
      removeListener(event, listener) {
        provider.events.removeListener(event, listener);
      },
    };

    return provider;
  }

  /**
   * Get the methods available in the wallet connect session.
   * @internal
   */
  #getNamespaceMethods() {
    const provider = this.#assertProvider();
    return provider.session?.namespaces[NAMESPACE]?.methods || [];
  }

  /**
   * Throw an error if provider is not initialized.
   * @internal
   */
  #assertProvider() {
    if (!this.#provider) {
      throw new Error("Provider not initialized");
    }

    return this.#provider;
  }

  /**
   * Get the last requested chains from the storage.
   * @internal
   */
  async #getRequestedChainsIds(): Promise<number[]> {
    const data = await walletStorage.get(storageKeys.requestedChains);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get the chainIds from the wallet connect session.
   * @internal
   */
  #getNamespaceChainsIds(): number[] {
    const provider = this.#provider;
    if (!provider) {
      return [];
    }
    const chainIds = provider.session?.namespaces[NAMESPACE]?.chains?.map(
      (chain) => parseInt(chain.split(":")[1] || ""),
    );

    return chainIds ?? [];
  }

  /**
   * if every chain requested were already requested earlier - then they are not stale
   * @param connectToChainId
   * @internal
   */
  async #isChainsStale(connectToChainId: number) {
    const namespaceMethods = this.#getNamespaceMethods();

    if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
      return false;
    }

    if (!isNewChainsStale) {
      return false;
    }

    const requestedChains = await this.#getRequestedChainsIds();
    const connectorChains = [connectToChainId];
    const namespaceChains = this.#getNamespaceChainsIds();

    if (
      namespaceChains.length &&
      !namespaceChains.some((id) => connectorChains.includes(id))
    ) {
      return false;
    }

    return !connectorChains.every((id) => requestedChains.includes(Number(id)));
  }

  /**
   * Set the requested chains to the storage.
   * @internal
   */
  #setRequestedChainsIds(chains: number[]) {
    walletStorage.set(storageKeys.requestedChains, JSON.stringify(chains));
  }

  /**
   * Disconnect the wallet and clear the session and perform cleanup.
   * @internal
   */
  #onDisconnect() {
    this.#setRequestedChainsIds([]);
    walletStorage.remove(storageKeys.lastUsedChainId);

    const provider = this.#provider;
    if (provider) {
      provider.removeListener("chainChanged", this.#onChainChanged);
      provider.removeListener("disconnect", this.#onDisconnect);
      provider.removeListener("session_delete", this.#onDisconnect);
    }
  }

  /**
   * Update the `chainId` on chainChanged event.
   * @internal
   */
  #onChainChanged(chainId: number | string) {
    this.chainId = normalizeChainId(chainId);
    walletStorage.set(storageKeys.lastUsedChainId, String(chainId));
  }
}
