import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import { MagicAuthOptions } from "../connectors/magic/types";
import type {
  MagicAuthConnectOptions,
  MagicAuthConnector as MagicAuthConnectorType,
} from "../connectors/magic";
import type {
  OAuthProvider as _OAuthProvider,
  OAuthRedirectResult,
} from "@magic-ext/oauth";
import { walletIds } from "../constants/walletIds";

export type MagicLinkAdditionalOptions = MagicAuthOptions;
export type MagicLinkOptions = WalletOptions<MagicAuthOptions>;
export type MagicLinkConnectOptions = MagicAuthConnectOptions;
export type MagicOAuthProvider = _OAuthProvider;

export class MagicLink extends AbstractClientWallet<
  MagicLinkOptions,
  MagicAuthConnectOptions
> {
  connector?: Connector;
  magicConnector?: MagicAuthConnectorType;
  oAuthRedirectResult?: OAuthRedirectResult;

  static meta = {
    iconURL:
      "ipfs://QmUMBFZGXxBpgDmZzZAHhbcCL5nYvZnVaYLTajsNjLcxMU/1-Icon_Magic_Color.svg",
    name: "Magic Link",
  };

  static id = walletIds.magicLink as string;

  public get walletName() {
    return "Magic Link" as const;
  }

  options: MagicLinkOptions;

  constructor(options: MagicLinkOptions) {
    super(MagicLink.id, options);
    this.options = options;
  }

  async initializeConnector() {
    // import the connector dynamically
    const { MagicAuthConnector } = await import("../connectors/magic");

    const magicConnector = new MagicAuthConnector({
      chains: this.chains,
      options: this.options,
    });

    this.magicConnector = magicConnector;
    this.connector = new WagmiAdapter(magicConnector);
    return this.connector;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      return await this.initializeConnector();
    }
    return this.connector;
  }

  getMagic() {
    if (!this.magicConnector) {
      throw new Error("Magic connector is not initialized");
    }
    return this.magicConnector.getMagicSDK();
  }

  async autoConnect(options?: MagicAuthConnectOptions) {
    await this.initializeConnector();
    await this.magicConnector?.initializeMagicSDK(options);
    const magic = this.getMagic();

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const isMagicRedirect = url.searchParams.get("magic_credential");
      if (isMagicRedirect) {
        try {
          this.oAuthRedirectResult = await magic.oauth.getRedirectResult(); // required to do this for social login
        } catch {
          // ignore
        }
      }
    }

    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      return super.autoConnect(options);
    }

    throw new Error("Magic user is not logged in");
  }

  async disconnect() {
    this.oAuthRedirectResult = undefined;
    const magic = this.getMagic();
    await magic.user.logout();
    return super.disconnect();
  }

  async connect(options: MagicAuthConnectOptions) {
    if ("email" in options && this.options.emailLogin === false) {
      throw new Error("Email login is disabled");
    }

    if ("phoneNumber" in options && this.options.smsLogin === false) {
      throw new Error("SMS login is disabled");
    }

    return super.connect(options);
  }
}
