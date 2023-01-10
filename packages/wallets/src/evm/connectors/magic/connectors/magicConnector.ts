import { createModal } from "../modal/view";
import { ConnectExtension } from "@magic-ext/connect";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";
import { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";
import { RPCProviderModule } from "@magic-sdk/provider/dist/types/modules/rpc-provider";
import { Chain, Connector, normalizeChainId } from "@wagmi/core";
import { providers, Signer } from "ethers";
import { getAddress } from "ethers/lib/utils";
import type { AbstractProvider } from "web3-core";

const IS_SERVER = typeof window === "undefined";

export interface MagicOptions {
  apiKey: string;
  accentColor?: string;
  isDarkMode?: boolean;
  customLogo?: string;
  customHeaderText?: string;
}

interface UserDetails {
  email: string;
  phoneNumber: string;
  oauthProvider: OAuthProvider;
}

export abstract class MagicConnector extends Connector<
  RPCProviderModule & AbstractProvider
> {
  ready = !IS_SERVER;

  readonly id = "magic";

  readonly name = "Magic";

  provider?: RPCProviderModule & AbstractProvider;

  isModalOpen = false;

  magicOptions: MagicOptions;

  protected constructor(config: { chains?: Chain[]; options: MagicOptions }) {
    super(config);
    this.magicOptions = config.options;
  }

  async getAccount() {
    const provider = new providers.Web3Provider(
      (await this.getProvider()) as unknown as providers.ExternalProvider,
    );
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    return getAddress(account);
  }

  async getUserDetailsByForm(
    enableSMSLogin: boolean,
    enableEmailLogin: boolean,
    oauthProviders: OAuthProvider[],
  ): Promise<UserDetails> {
    const output: UserDetails = (await createModal({
      accentColor: this.magicOptions.accentColor,
      isDarkMode: this.magicOptions.isDarkMode,
      customLogo: this.magicOptions.customLogo,
      customHeaderText: this.magicOptions.customHeaderText,
      enableSMSLogin: enableSMSLogin,
      enableEmailLogin: enableEmailLogin || true,
      oauthProviders,
    })) as UserDetails;

    this.isModalOpen = false;
    return output;
  }

  async getProvider() {
    if (this.provider) {
      return this.provider;
    }
    const magic = this.getMagicSDK();
    this.provider = magic.rpcProvider;
    return this.provider;
  }

  async getSigner(): Promise<Signer> {
    const provider = new providers.Web3Provider(
      (await this.getProvider()) as unknown as providers.ExternalProvider,
    );
    return provider.getSigner();
  }

  async isAuthorized() {
    const magic = this.getMagicSDK();
    try {
      return await magic.user.isLoggedIn();
    } catch (e) {
      return false;
    }
  }

  protected onAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.emit("disconnect");
    } else {
      this.emit("change", { account: getAddress(accounts[0]) });
    }
  }

  protected onChainChanged(chainId: string | number): void {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  }

  protected onDisconnect(): void {
    this.emit("disconnect");
  }

  async disconnect(): Promise<void> {
    const magic = this.getMagicSDK();
    await magic.user.logout();
  }

  abstract getMagicSDK():
    | InstanceWithExtensions<SDKBase, OAuthExtension[]>
    | InstanceWithExtensions<SDKBase, ConnectExtension[]>;
}
