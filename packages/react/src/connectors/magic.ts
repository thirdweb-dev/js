import { providers, utils } from "ethers";
import type {
  LoginWithMagicLinkConfiguration,
  Magic as MagicInstance,
  MagicSDKAdditionalConfiguration,
} from "magic-sdk";
import invariant from "tiny-invariant";
import { Chain, Connector, normalizeChainId } from "wagmi";

export interface MagicConnectorArguments
  extends MagicSDKAdditionalConfiguration {
  apiKey: string;
  doNotAutoConnect?: boolean;
  rpcUrls: Record<number, string>;
}

const __IS_SERVER__ = typeof window === "undefined";

const LOCAL_STORAGE_KEY = "--magic-link:configuration";

export class MagicConnector extends Connector {
  readonly id = "magic";
  readonly name = "Magic";
  readonly ready = __IS_SERVER__;

  override options: MagicConnectorArguments;
  private configuration?: LoginWithMagicLinkConfiguration;
  public magic?: MagicInstance;

  getConfiguration() {
    if (__IS_SERVER__) {
      return undefined;
    }

    const config = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (config) {
      this.configuration = JSON.parse(config);
    }
    return this.configuration;
  }

  constructor(config: { chains?: Chain[]; options: MagicConnectorArguments }) {
    super({ ...config, options: config?.options });
    this.options = config.options;

    if (!__IS_SERVER__) {
      this.ready = true;
      if (this.options.doNotAutoConnect || !this.getConfiguration()) {
        return;
      }
      this.connect(true);
    }
  }

  async connect(isAutoConnect?: true) {
    const { apiKey, doNotAutoConnect, rpcUrls, ...options } = this.options;
    const configuration = this.getConfiguration();

    try {
      invariant(
        configuration,
        "did you forget to set the configuration via: setConfiguration()?",
      );
      if (isAutoConnect) {
        configuration.showUI = false;
      }

      return import("magic-sdk").then(async (m) => {
        this.magic = new m.Magic(apiKey, options);

        await this.magic.auth.loginWithMagicLink(configuration);
        const provider = this.getProvider();
        if (provider.on) {
          provider.on("accountsChanged", this.onAccountsChanged);
          provider.on("chainChanged", this.onChainChanged);
          provider.on("disconnect", this.onDisconnect);
        }
        const account = await this.getAccount();
        const id = await this.getChainId();
        return {
          account,
          provider,
          chain: { id, unsupported: this.isChainUnsupported(id) },
        };
      });
    } catch (e) {
      if (!isAutoConnect) {
        throw e;
      }
      return {
        account: undefined,
        provider: undefined,
        chain: undefined,
      };
    }
  }
  async disconnect() {
    const provider = this.getProvider();
    if (provider?.removeListener) {
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect);
    }
    this.setConfiguration(undefined);
  }

  override async switchChain(chainId: number) {
    invariant(!this.isChainUnsupported(chainId), "chain is not supported");
    const provider = this.getProvider();
    if (provider?.removeListener) {
      provider.removeListener("accountsChanged", this.onAccountsChanged);
      provider.removeListener("chainChanged", this.onChainChanged);
      provider.removeListener("disconnect", this.onDisconnect);
    }

    this.options.network = {
      chainId,
      rpcUrl: this.options.rpcUrls[chainId],
    };
    await this.connect();
    this.onChainChanged(chainId);
    return this.chains.find((c) => c.id === chainId);
  }

  async getAccount() {
    const signer = await this.getSigner();
    return await signer.getAddress();
  }
  async getChainId() {
    const signer = await this.getSigner();
    return await signer.getChainId();
  }
  getProvider() {
    invariant(this.magic, "connector is not initialized");
    return new providers.Web3Provider(
      this.magic.rpcProvider as unknown as providers.ExternalProvider,
    );
  }
  async getSigner() {
    if (!this.magic) {
      await this.connect();
    }
    return this.getProvider().getSigner();
  }
  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  protected onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: utils.getAddress(accounts[0]) });
    }
  }

  protected override isChainUnsupported(chainId: number) {
    return !this.chains.some((x) => x.id === chainId);
  }

  protected onChainChanged(chainId: string | number) {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  protected onDisconnect() {
    this.emit("disconnect");
  }

  public setConfiguration(configuration?: LoginWithMagicLinkConfiguration) {
    if (configuration) {
      this.configuration = configuration;
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(configuration),
      );
    } else {
      this.configuration = undefined;
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
}
