import {
  toHex,
  type Hex,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  validateTypedData,
  isHex,
} from "viem";
import type { Address } from "abitype";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { DAppMetaData, WalletMetadata } from "../types.js";
import {
  deleteConnectParamsFromStorage,
  getSavedConnectParamsFromStorage,
  saveConnectParamsToStorage,
  walletStorage,
} from "../manager/storage.js";

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
import { stringify } from "../../utils/json.js";
import type { EthereumProvider } from "@walletconnect/ethereum-provider";
import {
  defineChain,
  getChainDataForChain,
  getRpcUrlForChain,
} from "../../chains/utils.js";
import type { Chain } from "../../chains/types.js";
import type { PreparedTransaction } from "../../transaction/prepare-transaction.js";
import { ethereum } from "../../chains/chain-definitions/ethereum.js";

const defaultWCProjectId = "145769e410f16970a79ff77b2d89a1e0";
// unused
// export const defaultWCRelayUrl = "wss://relay.walletconnect.com";
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

const isNewChainsStale = true;
const defaultShowQrModal = true;

type SavedConnectParams = {
  optionalChains?: Chain[];
  chain: Chain;
  pairingTopic?: string;
};

export const walletConnectMetadata: WalletMetadata = {
  name: "WalletConnect",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9IiMxQzdERkMiLz4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xXzQ2KSIvPgo8cGF0aCBkPSJNMjYuNDIyNyAzMS40NzMxQzMzLjkxNzEgMjQuMTc1NiA0Ni4wODI5IDI0LjE3NTYgNTMuNTc3MyAzMS40NzMxTDU0LjQ3OTYgMzIuMzU4QzU0Ljg1OCAzMi43MjA3IDU0Ljg1OCAzMy4zMTU1IDU0LjQ3OTYgMzMuNjc4Mkw1MS4zOTQ1IDM2LjY4MTNDNTEuMjA1MyAzNi44Njk5IDUwLjg5OTcgMzYuODY5OSA1MC43MTA1IDM2LjY4MTNMNDkuNDczNiAzNS40NzcyQzQ0LjIzNDcgMzAuMzg1IDM1Ljc2NTMgMzAuMzg1IDMwLjUyNjQgMzUuNDc3MkwyOS4yMDIxIDM2Ljc2ODRDMjkuMDEzIDM2Ljk1NyAyOC43MDc0IDM2Ljk1NyAyOC41MTgyIDM2Ljc2ODRMMjUuNDMzMSAzMy43NjUzQzI1LjA1NDcgMzMuNDAyNiAyNS4wNTQ3IDMyLjgwNzggMjUuNDMzMSAzMi40NDUxTDI2LjQyMjcgMzEuNDczMVpNNTkuOTY1OCAzNy42ODI0TDYyLjcxNjIgNDAuMzUxOEM2My4wOTQ2IDQwLjcxNDUgNjMuMDk0NiA0MS4zMDkzIDYyLjcxNjIgNDEuNjcyTDUwLjMzMjIgNTMuNzI4QzQ5Ljk1MzggNTQuMDkwNyA0OS4zNDI2IDU0LjA5MDcgNDguOTc4OCA1My43MjhMNDAuMTg5MiA0NS4xNjg0QzQwLjEwMTkgNDUuMDgxMyAzOS45NDE4IDQ1LjA4MTMgMzkuODU0NSA0NS4xNjg0TDMxLjA2NDkgNTMuNzI4QzMwLjY4NjUgNTQuMDkwNyAzMC4wNzUzIDU0LjA5MDcgMjkuNzExNSA1My43MjhMMTcuMjgzOCA0MS42NzJDMTYuOTA1NCA0MS4zMDkzIDE2LjkwNTQgNDAuNzE0NSAxNy4yODM4IDQwLjM1MThMMjAuMDM0MiAzNy42ODI0QzIwLjQxMjUgMzcuMzE5NyAyMS4wMjM3IDM3LjMxOTcgMjEuMzg3NSAzNy42ODI0TDMwLjE3NzIgNDYuMjQyQzMwLjI2NDUgNDYuMzI5IDMwLjQyNDUgNDYuMzI5IDMwLjUxMTkgNDYuMjQyTDM5LjMwMTUgMzcuNjgyNEMzOS42Nzk5IDM3LjMxOTcgNDAuMjkxIDM3LjMxOTcgNDAuNjU0OSAzNy42ODI0TDQ5LjQ0NDUgNDYuMjQyQzQ5LjUzMTggNDYuMzI5IDQ5LjY5MTkgNDYuMzI5IDQ5Ljc3OTIgNDYuMjQyTDU4LjU2ODggMzcuNjgyNEM1OC45NzYzIDM3LjMxOTcgNTkuNTg3NSAzNy4zMTk3IDU5Ljk2NTggMzcuNjgyNFoiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMV80NiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDI0Nzk1NSA0MC4wMDEyKSBzY2FsZSg4MCkiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNUQ5REY2Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwNkZGRiIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=",
  id: "walletconnect",
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
export function walletConnect(options: WalletConnectCreationOptions) {
  return new WalletConnect(options);
}

/**
 * Class to connect to a wallet using WalletConnect protocol.
 */
export class WalletConnect implements Wallet {
  private options: WalletConnectCreationOptions;
  private provider: InstanceType<typeof EthereumProvider> | undefined;
  private chain: Chain | undefined;
  private account?: Account | undefined;

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
    this.options = options;
    this.metadata = options?.metadata || walletConnectMetadata;
  }

  estimateGas?: ((tx: PreparedTransaction) => Promise<bigint>) | undefined;

  /**
   * Get the `chain` that the wallet is connected to.
   * @returns The chain
   * @example
   * ```ts
   * const chain = wallet.getChain();
   * ```
   */
  getChain(): Chain | undefined {
    return this.chain;
  }

  /**
   * Get the connected `Account` from the wallet.
   * @returns The connected account
   * @example
   * ```ts
   * const account = wallet.getAccount();
   * ```
   */
  getAccount(): Account | undefined {
    return this.account;
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
    const savedConnectParams: SavedConnectParams | null =
      await getSavedConnectParamsFromStorage(this.metadata.id);

    const provider = await this.initProvider(
      true,
      savedConnectParams
        ? {
            chain: savedConnectParams.chain,
            pairingTopic: savedConnectParams.pairingTopic,
            optionalChains: savedConnectParams.optionalChains,
          }
        : undefined,
    );

    const address = provider.accounts[0];

    if (!address) {
      throw new Error("No accounts found on provider.");
    }

    this.chain = defineChain(normalizeChainId(provider.chainId));

    return this.onConnect(address);
  }

  /**
   * @internal
   */
  private onConnect(address: string): Account {
    const wallet = this;
    const account: Account = {
      address,
      async sendTransaction(tx: SendTransactionOption) {
        const provider = wallet.assertProvider();

        if (!wallet.chain || !this.address) {
          throw new Error("Invalid chain or address");
        }

        const transactionHash = (await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              gas: tx.gas ? toHex(tx.gas) : undefined,
              value: tx.value ? toHex(tx.value) : undefined,
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
        const provider = wallet.assertProvider();
        return provider.request({
          method: "personal_sign",
          params: [message, this.address],
        });
      },
      async signTypedData(data) {
        const provider = wallet.assertProvider();
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

    this.account = account;

    return account;
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
    const provider = await this.initProvider(false, options);

    const isChainsState = await this.isChainsStale([
      provider.chainId,
      ...(options?.optionalChains || []).map((c) => c.id),
    ]);

    const targetChain = options?.chain || ethereum;
    const targetChainId = targetChain.id;

    const rpc = getRpcUrlForChain({
      chain: targetChain,
      client: this.options.client,
    });

    const { onDisplayUri, onSessionRequestSent } = options || {};

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
        pairingTopic: options?.pairingTopic,
        chains: [Number(targetChainId)],
        rpcMap: {
          [targetChainId.toString()]: rpc,
        },
      });

      this.setRequestedChainsIds([targetChainId]);
    }

    // If session exists and chains are authorized, enable provider for required chain
    const addresses = await provider.enable();
    const address = addresses[0];
    if (!address) {
      throw new Error("No accounts found on provider.");
    }

    this.chain = defineChain(normalizeChainId(provider.chainId));

    if (options) {
      const savedParams: SavedConnectParams = {
        optionalChains: options.optionalChains,
        chain: this.chain,
        pairingTopic: options.pairingTopic,
      };

      saveConnectParamsToStorage(this.metadata.id, savedParams);
    }

    if (options?.onDisplayUri) {
      provider.events.removeListener("display_uri", options.onDisplayUri);
    }

    return this.onConnect(address);
  }

  /**
   * Disconnect the wallet and clear the session.
   * @example
   * ```ts
   * await wallet.disconnect();
   * ```
   */
  async disconnect() {
    const provider = this.provider;
    if (provider) {
      this.onDisconnect();
      deleteConnectParamsFromStorage(this.metadata.id);
      provider.disconnect();
    }
  }

  /**
   * Switch the wallet to a blockchain with given chain.
   * @param chain - The chain to switch the wallet to.
   * @example
   * ```ts
   * await wallet.switchChain(1);
   * ```
   */
  async switchChain(chain: Chain) {
    const provider = this.assertProvider();

    const chainId = chain.id;
    try {
      const namespaceChains = this.getNamespaceChainsIds();
      const namespaceMethods = this.getNamespaceMethods();
      const isChainApproved = namespaceChains.includes(chainId);

      if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        const apiChain = await getChainDataForChain(chain);
        const firstExplorer = apiChain.explorers && apiChain.explorers[0];
        const blockExplorerUrls = firstExplorer
          ? { blockExplorerUrls: [firstExplorer.url] }
          : {};
        await provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [
            {
              chainId: toHex(apiChain.chainId),
              chainName: apiChain.name,
              nativeCurrency: apiChain.nativeCurrency,
              rpcUrls: getValidPublicRPCUrl(apiChain), // no clientId on purpose
              ...blockExplorerUrls,
            },
          ],
        });
        const requestedChains = await this.getRequestedChainsIds();
        requestedChains.push(chainId);
        this.setRequestedChainsIds(requestedChains);
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
  private async initProvider(
    isAutoConnect: boolean,
    connectionOptions?: WalletConnectConnectionOptions,
  ) {
    const { EthereumProvider, OPTIONAL_EVENTS, OPTIONAL_METHODS } =
      await import("@walletconnect/ethereum-provider");

    const targetChain = connectionOptions?.chain || ethereum;

    const rpc = getRpcUrlForChain({
      chain: targetChain,
      client: this.options.client,
    });

    const provider = await EthereumProvider.init({
      showQrModal:
        connectionOptions?.showQrModal === undefined
          ? defaultShowQrModal
          : connectionOptions.showQrModal,
      projectId: this.options?.projectId || defaultWCProjectId,
      optionalMethods: OPTIONAL_METHODS,
      optionalEvents: OPTIONAL_EVENTS,
      optionalChains: [targetChain.id],
      metadata: {
        name: this.options.dappMetadata?.name || defaultDappMetadata.name,
        description:
          this.options.dappMetadata?.description ||
          defaultDappMetadata.description,
        url: this.options.dappMetadata?.url || defaultDappMetadata.url,
        icons: [
          this.options.dappMetadata?.logoUrl || defaultDappMetadata.logoUrl,
        ],
      },
      rpcMap: {
        [targetChain.id]: rpc,
      },
      qrModalOptions: connectionOptions?.qrModalOptions,
      disableProviderPing: true,
    });

    provider.events.setMaxListeners(Infinity);
    this.provider = provider;

    if (!isAutoConnect) {
      const chains = [
        targetChain,
        ...(connectionOptions?.optionalChains || []),
      ];

      const isStale = await this.isChainsStale(chains.map((c) => c.id));
      if (isStale && provider.session) {
        await provider.disconnect();
      }
    }

    // setup listeners
    provider.on("disconnect", this.onDisconnect);
    provider.on("session_delete", this.onDisconnect);
    provider.on("chainChanged", this.onChainChanged);

    // try switching to correct chain
    if (
      connectionOptions?.chain &&
      provider.chainId !== connectionOptions?.chain.id
    ) {
      try {
        await this.switchChain(connectionOptions.chain);
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
  private getNamespaceMethods() {
    const provider = this.assertProvider();
    return provider.session?.namespaces[NAMESPACE]?.methods || [];
  }

  /**
   * Throw an error if provider is not initialized.
   * @internal
   */
  private assertProvider() {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    return this.provider;
  }

  /**
   * Get the last requested chains from the storage.
   * @internal
   */
  private async getRequestedChainsIds(): Promise<number[]> {
    const data = await walletStorage.get(storageKeys.requestedChains);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get the chainIds from the wallet connect session.
   * @internal
   */
  private getNamespaceChainsIds(): number[] {
    const provider = this.provider;
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
  private async isChainsStale(chains: number[]) {
    const namespaceMethods = this.getNamespaceMethods();

    // if chain adding method is available, then chains are not stale
    if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
      return false;
    }

    // if new chains are considered stale, then return true
    if (!isNewChainsStale) {
      return false;
    }

    const requestedChains = await this.getRequestedChainsIds();
    const namespaceChains = this.getNamespaceChainsIds();

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

  /**
   * Set the requested chains to the storage.
   * @internal
   */
  private setRequestedChainsIds(chains: number[]) {
    walletStorage.set(storageKeys.requestedChains, JSON.stringify(chains));
  }

  /**
   * Disconnect the wallet and clear the session and perform cleanup.
   * Note: must use arrow function to preserve `this` when it's passed down as a callback to the provider.
   * @internal
   */
  private onDisconnect = () => {
    this.setRequestedChainsIds([]);
    walletStorage.remove(storageKeys.lastUsedChainId);

    const provider = this.provider;
    if (provider) {
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect);
      provider.removeListener("session_delete", this.onDisconnect);
    }

    this.account = undefined;
    this.chain = undefined;
  };

  /**
   * Update the `chainId` on chainChanged event.
   * Note: must use arrow function to preserve `this` when it's passed down as a callback to the provider.
   * @internal
   */
  private onChainChanged = (newChainId: number | string) => {
    const chainId = normalizeChainId(newChainId);
    this.chain = defineChain(chainId);
    walletStorage.set(storageKeys.lastUsedChainId, String(chainId));
  };
}
