import {
  WagmiConnector,
  WagmiConnectorData,
} from "../../../lib/wagmi-connectors";
import {
  UserRejectedRequestError,
  SwitchChainError,
  normalizeChainId,
  ConnectorNotFoundError,
} from "../../../lib/wagmi-core";
import type {
  EthereumProviderConfig as BloctoOptions,
  EthereumProviderInterface as BloctoProvider,
} from "@blocto/sdk";
import BloctoSDK from "@blocto/sdk";
import { providers, utils } from "ethers";
import { walletIds } from "../../constants/walletIds";
import { Chain } from "@thirdweb-dev/chains";

type BloctoSigner = providers.JsonRpcSigner;

export class BloctoConnector extends WagmiConnector<
  BloctoProvider,
  BloctoOptions,
  BloctoSigner
> {
  readonly id = walletIds.blocto;
  readonly name = "Blocto";
  readonly ready = true;

  #provider?: BloctoProvider;

  #onAccountsChangedBind: typeof this.onAccountsChanged;
  #onChainChangedBind: typeof this.onChainChanged;
  #onDisconnectBind: typeof this.onDisconnect;

  constructor({
    chains,
    options,
  }: {
    chains?: Chain[];
    options: BloctoOptions;
  }) {
    super({
      chains,
      options,
    });

    this.#onAccountsChangedBind = this.onAccountsChanged.bind(this);
    this.#onChainChangedBind = this.onChainChanged.bind(this);
    this.#onDisconnectBind = this.onDisconnect.bind(this);
  }

  async connect({
    chainId,
  }: {
    chainId?: number;
  }): Promise<Required<WagmiConnectorData<BloctoProvider>>> {
    try {
      const provider = await this.getProvider();

      this.setupListeners();

      this.emit("message", { type: "connecting" });

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const account = utils.getAddress(accounts[0] as string);
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);

      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.chainId;
        unsupported = this.isChainUnsupported(id);
      }

      return {
        account,
        chain: { id, unsupported },
        provider,
      };
    } catch (error: unknown) {
      if (this.#isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error as Error);
      }
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    const provider = await this.getProvider();
    this.removeListeners();
    await provider.request({ method: "wallet_disconnect" });
  }

  async getAccount(): Promise<string> {
    const provider = await this.getProvider();
    const accounts = await provider.request({
      method: "eth_accounts",
    });
    const [address] = accounts || [];

    if (!address) {
      throw new Error("No accounts found");
    }

    return address;
  }

  async getChainId(): Promise<number> {
    const provider = await this.getProvider();
    const chainId = await provider.request({ method: "eth_chainId" });

    return normalizeChainId(chainId);
  }

  getProvider(): Promise<BloctoProvider> {
    if (!this.#provider) {
      const { appId, ...options } = this.options;
      this.#provider = new BloctoSDK({ ethereum: options, appId })?.ethereum;
    }

    if (!this.#provider) {
      throw new ConnectorNotFoundError();
    }

    return Promise.resolve(this.#provider);
  }

  async getSigner({
    chainId,
  }: { chainId?: number } = {}): Promise<BloctoSigner> {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ]);

    return new providers.Web3Provider(
      provider as unknown as providers.ExternalProvider,
      chainId,
    ).getSigner(account);
  }

  async isAuthorized(): Promise<boolean> {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    const id = utils.hexValue(chainId);
    const chain = this.chains.find((x) => x.chainId === chainId);
    const isBloctoSupportChain =
      provider._blocto.supportNetworkList[`${chainId}`];

    if (!chain || !isBloctoSupportChain) {
      throw new SwitchChainError(`Blocto unsupported chain: ${id}`);
    }

    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: id, rpcUrls: [chain?.rpc[0] ?? ""] }],
      });

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: id }],
      });

      return chain;
    } catch (error: unknown) {
      if (this.#isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error as Error);
      }
      throw new SwitchChainError(error as Error);
    }
  }

  protected onAccountsChanged(): void {
    // not supported yet
  }

  protected onChainChanged(chain: string | number): void {
    const id = normalizeChainId(chain);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
  }

  async setupListeners(): Promise<void> {
    const provider = await this.getProvider();

    provider.on("accountsChanged", this.#onAccountsChangedBind);
    provider.on("chainChanged", this.#onChainChangedBind);
    provider.on("disconnect", this.#onDisconnectBind);
  }

  async removeListeners(): Promise<void> {
    const provider = await this.getProvider();

    provider.off("accountsChanged", this.#onAccountsChangedBind);
    provider.off("chainChanged", this.#onChainChangedBind);
    provider.off("disconnect", this.#onDisconnectBind);
  }

  #isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((error as Error).message);
  }
}
