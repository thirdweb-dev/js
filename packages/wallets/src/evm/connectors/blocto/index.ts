import {
  WagmiConnector,
  WagmiConnectorData,
} from "../../../lib/wagmi-connectors/WagmiConnector";
import {
  UserRejectedRequestError,
  SwitchChainError,
  ConnectorNotFoundError,
} from "../../../lib/wagmi-core/errors";
import type {
  EthereumProviderConfig,
  EthereumProviderInterface as BloctoProvider,
} from "@blocto/sdk";
import BloctoSDK from "@blocto/sdk";
import { providers, utils } from "ethers";
import { walletIds } from "../../constants/walletIds";
import type { Chain } from "@thirdweb-dev/chains";
import { getValidPublicRPCUrl } from "../../utils/url";
import { normalizeChainId } from "../../../lib/wagmi-core/normalizeChainId";

type BloctoSigner = providers.JsonRpcSigner;
type BloctoOptions = Partial<EthereumProviderConfig>;

export class BloctoConnector extends WagmiConnector<
  BloctoProvider,
  BloctoOptions,
  BloctoSigner
> {
  readonly id = walletIds.blocto;
  readonly name = "Blocto";
  readonly ready = true;

  private _provider?: BloctoProvider;

  private _onAccountsChangedBind: typeof this.onAccountsChanged;
  private _onChainChangedBind: typeof this.onChainChanged;
  private _onDisconnectBind: typeof this.onDisconnect;

  constructor({
    chains,
    options = {},
  }: {
    chains?: Chain[];
    options?: BloctoOptions;
  }) {
    super({
      chains,
      options,
    });

    this._onAccountsChangedBind = this.onAccountsChanged.bind(this);
    this._onChainChangedBind = this.onChainChanged.bind(this);
    this._onDisconnectBind = this.onDisconnect.bind(this);
  }

  async connect(config?: {
    chainId?: number;
  }): Promise<Required<WagmiConnectorData<BloctoProvider>>> {
    try {
      const provider = await this.getProvider(config);

      this.setupListeners();
      this.emit("message", { type: "connecting" });

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      const account = utils.getAddress(accounts[0] as string);
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);

      return {
        account,
        chain: { id, unsupported },
        provider,
      };
    } catch (error: unknown) {
      this._handleConnectReset();
      if (this._isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error as Error);
      }
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    const provider = await this.getProvider();
    await provider.request({ method: "wallet_disconnect" });
    this.removeListeners();
    this._handleConnectReset();
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

  getProvider({ chainId }: { chainId?: number } = {}): Promise<BloctoProvider> {
    if (!this._provider) {
      const _chainId =
        chainId ?? this.options.chainId ?? this.chains[0]?.chainId ?? 1;
      const _rpc = this.chains.find((x) => x.chainId === _chainId)?.rpc[0];

      this._provider = new BloctoSDK({
        ethereum: { chainId: _chainId, rpc: _rpc },
        appId: this.options.appId,
      })?.ethereum;
    }

    if (!this._provider) {
      throw new ConnectorNotFoundError();
    }

    return Promise.resolve(this._provider);
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
    return !!this._provider?._blocto?.sessionKey ?? false;
  }

  async switchChain(chainId: number): Promise<Chain> {
    const provider = await this.getProvider();
    const id = utils.hexValue(chainId);

    const chain = this.chains.find((x) => x.chainId === chainId);
    if (!chain) {
      throw new SwitchChainError(new Error("chain not found on connector."));
    }

    const isBloctoSupportChain =
      provider._blocto.supportNetworkList[`${chainId}`];
    if (!isBloctoSupportChain) {
      throw new SwitchChainError(new Error(`Blocto unsupported chain: ${id}`));
    }

    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: id,
            rpcUrls: getValidPublicRPCUrl(chain), // no client id on purpose here
          },
        ],
      });

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: id }],
      });

      return chain;
    } catch (error: unknown) {
      if (this._isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error as Error);
      }
      throw new SwitchChainError(error as Error);
    }
  }

  protected onAccountsChanged(): void {
    // not supported yet
  }

  protected async onChainChanged(chain: string | number): Promise<void> {
    const id = normalizeChainId(chain);
    const unsupported = this.isChainUnsupported(id);
    const account = await this.getAccount();
    this.emit("change", { chain: { id, unsupported }, account });
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
  }

  async setupListeners(): Promise<void> {
    const provider = await this.getProvider();

    provider.on("accountsChanged", this._onAccountsChangedBind);
    provider.on("chainChanged", this._onChainChangedBind);
    provider.on("disconnect", this._onDisconnectBind);
  }

  async removeListeners(): Promise<void> {
    const provider = await this.getProvider();

    provider.off("accountsChanged", this._onAccountsChangedBind);
    provider.off("chainChanged", this._onChainChangedBind);
    provider.off("disconnect", this._onDisconnectBind);
  }

  private _isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((error as Error).message);
  }

  private _handleConnectReset() {
    this._provider = undefined;
  }
}
