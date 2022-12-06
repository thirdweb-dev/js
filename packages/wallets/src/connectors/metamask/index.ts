import { getConnectorStorage } from "../../utils/storage";
import { InjectedConnector } from "../injected";
import {
  Chain,
  ConnectorNotFoundError,
  Ethereum,
  InjectedConnectorOptions,
  ResourceUnavailableError,
  RpcError,
  UserRejectedRequestError,
} from "@wagmi/core";
import type { Address } from "abitype";
import { getAddress } from "ethers/lib/utils.js";

declare interface Window {
  ethereum: Ethereum;
}

export type MetaMaskConnectorOptions = Pick<
  InjectedConnectorOptions,
  "shimChainChangedDisconnect" | "shimDisconnect"
> & {
  /**
   * While "disconnected" with `shimDisconnect`, allows user to select a different MetaMask account (than the currently connected account) when trying to connect.
   */
  UNSTABLE_shimOnConnectSelectAccount?: boolean;
};

export class MetaMaskConnector extends InjectedConnector {
  readonly id = "metaMask";
  readonly ready =
    typeof window !== "undefined" &&
    !!this.#findProvider(window.ethereum as Ethereum);

  #provider?: Window["ethereum"];
  #UNSTABLE_shimOnConnectSelectAccount: MetaMaskConnectorOptions["UNSTABLE_shimOnConnectSelectAccount"];

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[];
    options?: MetaMaskConnectorOptions;
  } = {}) {
    const options = {
      name: "MetaMask",
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      ...options_,
    };
    super({ chains, options });

    this.#UNSTABLE_shimOnConnectSelectAccount =
      options.UNSTABLE_shimOnConnectSelectAccount;
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();
      if (!provider) {
        throw new ConnectorNotFoundError();
      }

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      // Attempt to show wallet select prompt with `wallet_requestPermissions` when
      // `shimDisconnect` is active and account is in disconnected state (flag in storage)
      let account: Address | null = null;
      if (
        this.#UNSTABLE_shimOnConnectSelectAccount &&
        this.options?.shimDisconnect &&
        (await getConnectorStorage().getItem(this.shimDisconnectKey))
      ) {
        account = await this.getAccount().catch(() => null);
        const isConnected = !!account;
        if (isConnected) {
          // Attempt to show another prompt for selecting wallet if already connected
          await provider
            .request({
              method: "wallet_requestPermissions",
              params: [{ eth_accounts: {} }],
            })
            .catch(() => null);
        }
      }

      if (!account) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        account = getAddress(accounts[0] as string);
      }

      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      if (this.options?.shimDisconnect) {
        await getConnectorStorage().setItem(this.shimDisconnectKey, true);
      }

      return { account, chain: { id, unsupported }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error);
      }
      if ((error as RpcError).code === -32002) {
        throw new ResourceUnavailableError(error);
      }
      throw error;
    }
  }

  async getProvider() {
    if (typeof window !== "undefined") {
      // TODO: Fallback to `ethereum#initialized` event for async injection
      // https://github.com/MetaMask/detect-provider#synchronous-and-asynchronous-injection=
      this.#provider = this.#findProvider(window.ethereum as Ethereum);
    }
    return this.#provider as Ethereum;
  }

  #getReady(ethereum?: Ethereum) {
    const isMetaMask = !!ethereum?.isMetaMask;
    if (!isMetaMask) {
      return;
    }
    // Brave tries to make itself look like MetaMask
    // Could also try RPC `web3_clientVersion` if following is unreliable
    if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) {
      return;
    }
    if (ethereum.isAvalanche) {
      return;
    }
    if (ethereum.isKuCoinWallet) {
      return;
    }
    if (ethereum.isPortal) {
      return;
    }
    if (ethereum.isTokenPocket) {
      return;
    }
    if (ethereum.isTokenary) {
      return;
    }
    return ethereum;
  }

  #findProvider(ethereum?: Ethereum) {
    if (ethereum?.providers) {
      return ethereum.providers.find(this.#getReady);
    }
    return this.#getReady(ethereum);
  }
}
