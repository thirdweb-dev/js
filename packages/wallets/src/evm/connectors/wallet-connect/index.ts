import { AsyncStorage } from "../../../core";
import { DAppMetaData } from "../../../core/types/dAppMeta";
import {
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
} from "../../../lib/wagmi-core/errors";
import { type Chain } from "@thirdweb-dev/chains";
import type WalletConnectProvider from "@walletconnect/ethereum-provider";
import { providers, utils } from "ethers";
import { walletIds } from "../../constants/walletIds";
import { QRModalOptions } from "./qrModalOptions";
import { getValidPublicRPCUrl } from "../../utils/url";
import { WagmiConnector } from "../../../lib/wagmi-connectors/WagmiConnector";

const chainsToRequest = new Set([1, 137, 10, 42161, 56]);

type WalletConnectOptions = {
  qrModalOptions?: QRModalOptions;
  projectId: string;
  qrcode?: boolean;
  dappMetadata: DAppMetaData;
  storage: AsyncStorage;
  /**
   * If a new chain is added to a previously existing configured connector `chains`, this flag
   * will determine if that chain should be considered as stale. A stale chain is a chain that
   * WalletConnect has yet to establish a relationship with (ie. the user has not approved or
   * rejected the chain).
   * Defaults to `true`.
   *
   * Preface: Whereas WalletConnect v1 supported dynamic chain switching, WalletConnect v2 requires
   * the user to pre-approve a set of chains up-front. This comes with consequent UX nuances (see below) when
   * a user tries to switch to a chain that they have not approved.
   *
   * This flag mainly affects the behavior when a wallet does not support dynamic chain authorization
   * with WalletConnect v2.
   *
   * If `true` (default), the new chain will be treated as a stale chain. If the user
   * has yet to establish a relationship (approved/rejected) with this chain in their WalletConnect
   * session, the connector will disconnect upon the dapp auto-connecting, and the user will have to
   * reconnect to the dapp (revalidate the chain) in order to approve the newly added chain.
   * This is the default behavior to avoid an unexpected error upon switching chains which may
   * be a confusing user experience (ie. the user will not know they have to reconnect
   * unless the dapp handles these types of errors).
   *
   * If `false`, the new chain will be treated as a validated chain. This means that if the user
   * has yet to establish a relationship with the chain in their WalletConnect session, wagmi will successfully
   * auto-connect the user. This comes with the trade-off that the connector will throw an error
   * when attempting to switch to the unapproved chain. This may be useful in cases where a dapp constantly
   * modifies their configured chains, and they do not want to disconnect the user upon
   * auto-connecting. If the user decides to switch to the unapproved chain, it is important that the
   * dapp handles this error and prompts the user to reconnect to the dapp in order to approve
   * the newly added chain.
   *
   */
  isNewChainsStale?: boolean;
};
type WalletConnectSigner = providers.JsonRpcSigner;

type ConnectConfig = {
  /** Target chain to connect to. */
  chainId?: number;
  /** If provided, will attempt to connect to an existing pairing. */
  pairingTopic?: string;
};

const NAMESPACE = "eip155";
const REQUESTED_CHAINS_KEY = "wagmi.requestedChains";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";
const LAST_USED_CHAIN_ID = "last-used-chain-id";

export class WalletConnectConnector extends WagmiConnector<
  WalletConnectProvider,
  WalletConnectOptions,
  WalletConnectSigner
> {
  readonly id = walletIds.walletConnect;
  readonly name = "WalletConnect";
  readonly ready = true;

  #provider?: WalletConnectProvider;
  #initProviderPromise?: Promise<void>;
  #storage: AsyncStorage;
  filteredChains: Chain[];
  showWalletConnectModal: boolean;

  constructor(config: { chains?: Chain[]; options: WalletConnectOptions }) {
    super({
      ...config,
      options: { isNewChainsStale: true, ...config.options },
    });
    this.#storage = config.options.storage;
    this.#createProvider();

    this.filteredChains =
      this.chains.length > 50
        ? this.chains.filter((c) => {
            return chainsToRequest.has(c.chainId);
          })
        : this.chains;

    this.showWalletConnectModal = this.options.qrcode !== false;
  }

  async connect({ chainId: chainIdP, pairingTopic }: ConnectConfig = {}) {
    try {
      let targetChainId = chainIdP;
      if (!targetChainId) {
        const lastUsedChainIdStr = await this.#storage.getItem(
          LAST_USED_CHAIN_ID,
        );
        const lastUsedChainId = lastUsedChainIdStr
          ? parseInt(lastUsedChainIdStr)
          : undefined;
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) {
          targetChainId = lastUsedChainId;
        } else {
          targetChainId = this.filteredChains[0]?.chainId;
        }
      }
      if (!targetChainId) {
        throw new Error("No chains found on connector.");
      }

      const provider = await this.getProvider();
      this.setupListeners();

      const isChainsStale = await this.#isChainsStale();

      // If there is an active session with stale chains, disconnect the current session.
      if (provider.session && isChainsStale) {
        await provider.disconnect();
      }

      // If there no active session, or the chains are stale, connect.
      if (!provider.session || isChainsStale) {
        const optionalChains = this.filteredChains
          .filter((chain) => chain.chainId !== targetChainId)
          .map((optionalChain) => optionalChain.chainId);

        this.emit("message", { type: "connecting" });

        await provider.connect({
          pairingTopic,
          chains: [targetChainId],
          optionalChains:
            optionalChains.length > 0 ? optionalChains : [targetChainId],
        });

        await this.#setRequestedChainsIds(
          this.filteredChains.map(({ chainId }) => chainId),
        );
      }

      // If session exists and chains are authorized, enable provider for required chain
      const accounts = await provider.enable();
      if (!accounts[0]) {
        throw new Error("No accounts found on provider.");
      }
      const account = utils.getAddress(accounts[0]);
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(provider),
      };
    } catch (error) {
      if (/user rejected/i.test((error as ProviderRpcError)?.message)) {
        throw new UserRejectedRequestError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    const cleanup = () => {
      if (typeof localStorage === "undefined") {
        return;
      }
      for (const key in localStorage) {
        if (key.startsWith("wc@2")) {
          localStorage.removeItem(key);
        }
      }
    };

    cleanup();

    const provider = await this.getProvider();

    const disconnectProvider = async () => {
      try {
        await provider.disconnect();
      } catch (error) {
        if (!/No matching key/i.test((error as Error).message)) {
          throw error;
        }
      } finally {
        this.#removeListeners();
        await this.#setRequestedChainsIds([]);
        cleanup();
      }
    };

    disconnectProvider();
  }

  async getAccount() {
    const { accounts } = await this.getProvider();
    if (!accounts[0]) {
      throw new Error("No accounts found on provider.");
    }
    return utils.getAddress(accounts[0]);
  }

  async getChainId() {
    const { chainId } = await this.getProvider();
    return chainId;
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    if (!this.#provider) {
      await this.#createProvider();
    }
    if (chainId) {
      await this.switchChain(chainId);
    }
    if (!this.#provider) {
      throw new Error("No provider found.");
    }

    return this.#provider;
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
      this.getAccount(),
    ]);
    return new providers.Web3Provider(provider, chainId).getSigner(account);
  }

  async isAuthorized() {
    try {
      const [account, provider] = await Promise.all([
        this.getAccount(),
        this.getProvider(),
      ]);
      const isChainsStale = await this.#isChainsStale();

      // If an account does not exist on the session, then the connector is unauthorized.
      if (!account) {
        return false;
      }

      // If the chains are stale on the session, then the connector is unauthorized.
      if (isChainsStale && provider.session) {
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

  async switchChain(chainId: number) {
    const chain = this.chains.find((chain_) => chain_.chainId === chainId);

    if (!chain) {
      throw new SwitchChainError(
        `Chain with ID: ${chainId}, not found on connector.`,
      );
    }

    try {
      const provider = await this.getProvider();
      const namespaceChains = this.#getNamespaceChainsIds();
      const namespaceMethods = this.#getNamespaceMethods();
      const isChainApproved = namespaceChains.includes(chainId);

      if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        const firstExplorer = chain.explorers && chain.explorers[0];
        const blockExplorerUrls = firstExplorer
          ? { blockExplorerUrls: [firstExplorer.url] }
          : {};
        await provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [
            {
              chainId: utils.hexValue(chain.chainId),
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: getValidPublicRPCUrl(chain), // no clientId on purpose
              ...blockExplorerUrls,
            },
          ],
        });
        const requestedChains = await this.#getRequestedChainsIds();
        requestedChains.push(chainId);
        await this.#setRequestedChainsIds(requestedChains);
      }
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: utils.hexValue(chainId) }],
      });

      return chain;
    } catch (error) {
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

  async #createProvider() {
    if (!this.#initProviderPromise && typeof window !== "undefined") {
      this.#initProviderPromise = this.initProvider();
    }
    return this.#initProviderPromise;
  }

  async initProvider() {
    const {
      default: EthereumProvider,
      OPTIONAL_EVENTS,
      OPTIONAL_METHODS,
    } = await import("@walletconnect/ethereum-provider");
    const [defaultChain, ...optionalChains] = this.filteredChains.map(
      ({ chainId }) => chainId,
    );

    if (defaultChain) {
      // EthereumProvider populates & deduplicates required methods and events internally
      this.#provider = await EthereumProvider.init({
        showQrModal: this.showWalletConnectModal,
        projectId: this.options.projectId,
        optionalMethods: OPTIONAL_METHODS,
        optionalEvents: OPTIONAL_EVENTS,
        chains: [defaultChain],
        optionalChains: optionalChains,

        metadata: {
          name: this.options.dappMetadata.name,
          description: this.options.dappMetadata.description || "",
          url: this.options.dappMetadata.url,
          icons: [this.options.dappMetadata.logoUrl || ""],
        },
        rpcMap: Object.fromEntries(
          this.filteredChains.map((chain) => [
            chain.chainId,
            chain.rpc[0] || "", // TODO: handle chain.rpc being empty array
          ]),
        ),

        qrModalOptions: this.options.qrModalOptions,
      });
    }
  }

  /**
   * Checks if the target chains match the chains that were
   * initially requested by the connector for the WalletConnect session.
   * If there is a mismatch, this means that the chains on the connector
   * are considered stale, and need to be revalidated at a later point (via
   * connection).
   *
   * There may be a scenario where a dapp adds a chain to the
   * connector later on, however, this chain will not have been approved or rejected
   * by the wallet. In this case, the chain is considered stale.
   *
   * There are exceptions however:
   * -  If the wallet supports dynamic chain addition via `eth_addEthereumChain`,
   *    then the chain is not considered stale.
   * -  If the `isNewChainsStale` flag is falsy on the connector, then the chain is
   *    not considered stale.
   *
   * For the above cases, chain validation occurs dynamically when the user
   * attempts to switch chain.
   *
   * Also check that dapp supports at least 1 chain from previously approved session.
   */
  async #isChainsStale() {
    const namespaceMethods = this.#getNamespaceMethods();
    if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
      return false;
    }
    if (!this.options.isNewChainsStale) {
      return false;
    }

    const requestedChains = await this.#getRequestedChainsIds();
    const connectorChains = this.filteredChains.map(({ chainId }) => chainId);
    const namespaceChains = this.#getNamespaceChainsIds();

    if (
      namespaceChains.length &&
      !namespaceChains.some((id) => connectorChains.includes(id))
    ) {
      return false;
    }

    return !connectorChains.every((id) => requestedChains.includes(id));
  }

  async setupListeners() {
    if (!this.#provider) {
      return;
    }
    this.#removeListeners();
    this.#provider.on("accountsChanged", this.onAccountsChanged);
    this.#provider.on("chainChanged", this.onChainChanged);
    this.#provider.on("disconnect", this.onDisconnect);
    this.#provider.on("session_delete", this.onDisconnect);
    this.#provider.on("display_uri", this.onDisplayUri);
    this.#provider.on("connect", this.onConnect);
  }

  #removeListeners() {
    if (!this.#provider) {
      return;
    }
    this.#provider.removeListener("accountsChanged", this.onAccountsChanged);
    this.#provider.removeListener("chainChanged", this.onChainChanged);
    this.#provider.removeListener("disconnect", this.onDisconnect);
    this.#provider.removeListener("session_delete", this.onDisconnect);
    this.#provider.removeListener("display_uri", this.onDisplayUri);
    this.#provider.removeListener("connect", this.onConnect);
  }

  async #setRequestedChainsIds(chains: number[]) {
    await this.#storage.setItem(REQUESTED_CHAINS_KEY, JSON.stringify(chains));
  }

  async #getRequestedChainsIds(): Promise<number[]> {
    const data = await this.#storage.getItem(REQUESTED_CHAINS_KEY);
    return data ? JSON.parse(data) : [];
  }

  #getNamespaceChainsIds() {
    if (!this.#provider) {
      return [];
    }
    const chainIds = this.#provider.session?.namespaces[NAMESPACE]?.chains?.map(
      (chain) => parseInt(chain.split(":")[1] || ""),
    );
    return chainIds ?? [];
  }

  #getNamespaceMethods() {
    if (!this.#provider) {
      return [];
    }
    const methods = this.#provider.session?.namespaces[NAMESPACE]?.methods;
    return methods ?? [];
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      if (accounts[0]) {
        this.emit("change", { account: utils.getAddress(accounts[0]) });
      }
    }
  };

  protected onChainChanged = async (chainId: number | string) => {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    await this.#storage.setItem(LAST_USED_CHAIN_ID, String(chainId));
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    await this.#setRequestedChainsIds([]);
    await this.#storage.removeItem(LAST_USED_CHAIN_ID);
    this.emit("disconnect");
  };

  protected onDisplayUri = (uri: string) => {
    this.emit("message", { type: "display_uri", data: uri });
  };

  protected onConnect = () => {
    this.emit("connect", { provider: this.#provider });
  };
}
