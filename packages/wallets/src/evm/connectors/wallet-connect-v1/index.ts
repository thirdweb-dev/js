import { AsyncStorage } from "../../../core/AsyncStorage";
import {
  SwitchChainError,
  UserRejectedRequestError,
  ChainNotConfiguredError,
  normalizeChainId,
  Connector,
  ProviderRpcError,
} from "../../../lib/wagmi-core";
import type WalletConnectProvider from "./walletconnect-legacy-provider/index";
import { Chain } from "@thirdweb-dev/chains";
import WalletConnect from "@walletconnect/legacy-client";
import { IWalletConnectSession } from "@walletconnect/legacy-types";
import { utils, providers } from "ethers";

/**
 * Wallets that support chain switching through WalletConnect
 * - imToken (token.im)
 * - MetaMask (metamask.io)
 * - Rainbow (rainbow.me)
 * - Trust Wallet (trustwallet.com)
 */
const switchChainAllowedRegex = /(imtoken|metamask|rainbow|trust wallet)/i;

const LAST_USED_CHAIN_ID = "last-used-chain-id";
const LAST_SESSION = "last-session";

type WalletConnectOptions = ConstructorParameters<
  typeof WalletConnectProvider
>[0];

type WalletConnectSigner = providers.JsonRpcSigner;

export class WalletConnectV1Connector extends Connector<
  WalletConnectProvider,
  WalletConnectOptions,
  WalletConnectSigner
> {
  readonly id = "walletConnectV1";
  readonly name = "WalletConnectV1";
  readonly ready = true;

  #provider?: WalletConnectProvider;
  #storage: AsyncStorage;

  walletName?: string;

  constructor(config: {
    chains?: Chain[];
    storage: AsyncStorage;
    options: WalletConnectOptions;
  }) {
    super(config);

    this.#storage = config.storage;
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      let targetChainId = chainId;
      if (!targetChainId) {
        const lastUsedChainIdStr = await this.#storage.getItem(
          LAST_USED_CHAIN_ID,
        );
        const lastUsedChainId = lastUsedChainIdStr
          ? parseInt(lastUsedChainIdStr)
          : undefined;
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) {
          targetChainId = lastUsedChainId;
        }
      }

      const provider = await this.getProvider({
        chainId: targetChainId,
        create: true,
      });

      // Defer message to the next tick to ensure wallet connect data (provided by `.enable()`) is available
      setTimeout(() => this.emit("message", { type: "connecting" }), 0);

      const accounts = await provider.enable();
      const account = utils.getAddress(accounts[0] as string);
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      // Not all WalletConnect options support programmatic chain switching
      // Only enable for wallet options that do
      this.walletName = provider.connector?.peerMeta?.name ?? "";
      if (switchChainAllowedRegex.test(this.walletName)) {
        this.switchChain = this.#switchChain;

        // switch to target chainId
        if (chainId) {
          try {
            await this.switchChain(chainId);
            id = chainId;
            unsupported = this.isChainUnsupported(id);
          } catch (e) {
            console.error("could not switch chain", e);
          }
        }
      }

      this.#handleConnected();
      this.emit("connect", {
        account,
        chain: { id, unsupported },
        provider,
      });

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          provider as providers.ExternalProvider,
        ),
      };
    } catch (error) {
      if (/user closed modal/i.test((error as ProviderRpcError).message)) {
        throw new UserRejectedRequestError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    const provider = await this.getProvider();
    await provider.disconnect();
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = provider.accounts;
    // return checksum address
    return utils.getAddress(accounts[0] as string);
  }

  async getChainId() {
    const provider = await this.getProvider();
    const chainId = normalizeChainId(provider.chainId);
    return chainId;
  }

  async getProvider({
    chainId,
    create,
  }: { chainId?: number; create?: boolean } = {}) {
    // Force create new provider
    if (!this.#provider || chainId || create) {
      const rpc = !this.options?.infuraId
        ? this.chains.reduce(
            (rpc_, chain) => ({
              ...rpc_,
              [chain.chainId]: chain.rpc[0],
            }),
            {},
          )
        : {};

      const WalletConnectProvider = (
        await import("./walletconnect-legacy-provider/index")
      ).default;

      const sessionStr = await this.#storage.getItem(LAST_SESSION);
      const session = sessionStr ? JSON.parse(sessionStr) : undefined;
      this.walletName = session?.peerMeta?.name || undefined;

      this.#provider = new WalletConnectProvider({
        ...this.options,
        chainId,
        rpc: { ...rpc, ...this.options?.rpc },
        session: session ? (session as IWalletConnectSession) : undefined,
      });

      this.setupListeners();
    }

    return this.#provider;
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
      this.getAccount(),
    ]);
    return new providers.Web3Provider(
      provider as providers.ExternalProvider,
      chainId,
    ).getSigner(account);
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  async #switchChain(chainId: number) {
    const provider = await this.getProvider();
    const chainIdHex = utils.hexValue(chainId);

    try {
      // Set up a race between `wallet_switchEthereumChain` & the `chainChanged` event
      // to ensure the chain has been switched. This is because there could be a case
      // where a wallet may not resolve the `wallet_switchEthereumChain` method, or
      // resolves slower than `chainChanged`.
      await Promise.race([
        provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        }),
        new Promise((res) =>
          this.on("change", ({ chain }) => {
            if (chain?.id === chainId) {
              res(chainId);
            }
          }),
        ),
      ]);
      return (
        this.chains.find((x) => x.chainId === chainId) ??
        ({
          chainId: chainId,
          name: `Chain ${chainIdHex}`,
          network: `${chainIdHex}`,
          nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
          rpc: [""],
          shortName: "eth",
          chain: "ETH",
          slug: "ethereum",
          testnet: false,
        } as Chain)
      );
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : (error as ProviderRpcError)?.message;
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error);
      }

      const chain = this.chains.find((x) => x.chainId === chainId);

      // if chain is not supported
      if (!chain) {
        throw new SwitchChainError(
          `Chain ${chainId} is not added in the list of supported chains`,
        );
      }

      // if chain is not configured in the wallet
      if (/Unrecognized chain ID/i.test(message)) {
        // configure it
        try {
          this.emit("message", { type: "add_chain" });
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [chain.rpc[0] ?? ""],
                blockExplorerUrls: this.getBlockExplorerUrls(chain),
              },
            ],
          });

          return chain;
        } catch (e) {
          throw new ChainNotConfiguredError({
            chainId,
            connectorId: this.id,
          });
        }
      } else {
        throw new SwitchChainError(error);
      }
    }
  }

  async #handleConnected() {
    const session = this.#provider?.connector.session;
    this.walletName = session?.peerMeta?.name || "";
    const sessionStr = JSON.stringify(session);

    this.#storage.setItem(LAST_SESSION, sessionStr);
  }

  async setupListeners() {
    if (!this.#provider) {
      return;
    }
    this.#removeListeners();

    this.#provider.on("accountsChanged", this.onAccountsChanged);
    this.#provider.on("chainChanged", this.onChainChanged);
    this.#provider.on("disconnect", this.onDisconnect);
    this.#provider.on("message", this.onMessage);
    this.#provider.on("switchChain", this.onSwitchChain);
    this.#provider.connector.on("display_uri", this.onDisplayUri);
    this.#provider.connector.on("call_request_sent", this.onRequestSent);
  }

  #removeListeners() {
    if (!this.#provider) {
      return;
    }

    this.#provider.removeListener("accountsChanged", this.onAccountsChanged);
    this.#provider.removeListener("chainChanged", this.onChainChanged);
    this.#provider.removeListener("disconnect", this.onDisconnect);
    this.#provider.removeListener("message", this.onMessage);
    this.#provider.removeListener("switchChain", this.onSwitchChain);
    (this.#provider.connector as WalletConnect).off("display_uri");
    (this.#provider.connector as WalletConnect).off("call_request_sent");
  }

  protected onSwitchChain = () => {
    this.emit("message", { type: "switch_chain" });
  };

  protected onDisplayUri = async (
    error: any,
    payload: { params: string[] },
  ) => {
    if (error) {
      this.emit("message", { data: error, type: "display_uri_error" });
    }
    this.emit("message", { data: payload.params[0], type: "display_uri" });
  };

  protected onRequestSent = (error: any, payload: { params: string[] }) => {
    if (error) {
      console.log("wcV1.onRequestSent", error);
      this.emit("message", { data: error, type: "request" });
    }
    this.emit("message", { data: payload.params[0], type: "request" });
  };

  protected onMessage = (message: { type: string; data: unknown }) => {
    this.emit("message", message);
  };

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: utils.getAddress(accounts[0] as string) });
    }
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.#storage.setItem(LAST_USED_CHAIN_ID, String(chainId));
    this.emit("change", { chain: { id, unsupported } });
  };

  protected onDisconnect = async () => {
    this.walletName = undefined;
    this.#storage.removeItem(LAST_USED_CHAIN_ID);
    this.#storage.removeItem(LAST_SESSION);

    this.#removeListeners();

    this.emit("disconnect");
  };
}
