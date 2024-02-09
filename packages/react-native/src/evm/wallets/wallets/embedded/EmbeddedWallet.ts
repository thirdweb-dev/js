import {
  WalletOptions,
  AbstractClientWallet,
  EmbeddedWalletAdditionalOptions,
  walletIds,
  WalletConnectReceiverConfig,
} from "@thirdweb-dev/wallets";
import type { EmbeddedWalletConnector } from "../../connectors/embedded-wallet/embedded-connector";
import {
  AuthParams,
  EmbeddedWalletConnectionArgs,
} from "../../connectors/embedded-wallet/types";
import { EMAIL_WALLET_ICON } from "../../../assets/svgs";
import { AUTH_OPTIONS_ICONS } from "../../types/embedded-wallet";
import { getRandomString } from "../../connectors/embedded-wallet/embedded/helpers/getRandomValues";
import { ANALYTICS } from "../../connectors/embedded-wallet/embedded/helpers/analytics";
import { WalletMeta } from "@thirdweb-dev/wallets/src/evm/wallets/base";

export type EmbeddedWalletOptions = WalletOptions<
  EmbeddedWalletAdditionalOptions & WalletConnectReceiverConfig
>;

export class EmbeddedWallet extends AbstractClientWallet<
  EmbeddedWalletOptions,
  EmbeddedWalletConnectionArgs
> {
  connector?: EmbeddedWalletConnector;
  options: EmbeddedWalletOptions;

  static async sendVerificationEmail(options: {
    email: string;
    clientId: string;
  }) {
    const { sendVerificationEmail } = await import(
      "../../connectors/embedded-wallet/embedded/auth"
    );
    return sendVerificationEmail(options);
  }

  static meta = {
    name: "Embedded Wallet",
    iconURL: EMAIL_WALLET_ICON,
  };

  static id = walletIds.embeddedWallet;

  constructor(options: EmbeddedWalletOptions) {
    super(EmbeddedWallet.id, options);

    this.options = options;

    this.initializeConnector();

    this.setupListeners();
  }

  async getConnector(): Promise<EmbeddedWalletConnector> {
    if (!this.connector) {
      return await this.initializeConnector();
    }
    return this.connector;
  }

  async initializeConnector() {
    const { EmbeddedWalletConnector } = await import(
      "../../connectors/embedded-wallet/embedded-connector"
    );
    this.connector = new EmbeddedWalletConnector({
      ...this.options,
      clientId: this.options.clientId,
      chains: this.chains,
    });

    return this.connector;
  }

  async sendVerificationEmail(email: string) {
    return this.connector?.sendVerificationEmail({ email });
  }

  async authenticate(params: AuthParams) {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.authenticate(params);
  }

  async deleteActiveAccount() {
    return this.connector?.deleteActiveAccount();
  }

  getMeta(): WalletMeta {
    const strategy = this.connector?.getConnectedAuthStrategy();
    const meta = (this.constructor as typeof AbstractClientWallet).meta;
    switch (strategy) {
      case "facebook":
      case "apple":
      case "google":
        return {
          ...meta,
          iconURL: AUTH_OPTIONS_ICONS[strategy],
        };
      default:
        return meta;
    }
  }

  onConnected = () => {
    this.emit("message", { type: "connected" });
  };

  onDisconnect = () => {
    this.removeListeners();
    ANALYTICS.nonce = getRandomString(16);
  };

  onChange = async (payload: any) => {
    if (payload.chain) {
      // chain changed
    } else if (payload.account) {
      //account change
    }
  };

  getEmail() {
    return this.connector?.getEmail();
  }

  onEmailSent = ({ email }: { email: string }) => {
    this.emit("message", { type: "emailSent", data: email });
  };

  setupListeners() {
    if (!this.connector) {
      return;
    }

    this.removeListeners();
    this.connector.on("emailSent", this.onEmailSent);
    this.connector.on("connected", this.onConnected);
    this.connector.on("disconnect", this.onDisconnect);
    this.connector.on("change", this.onChange);
  }

  removeListeners() {
    if (!this.connector) {
      return;
    }
    this.connector.removeListener("emailSent", this.onEmailSent);
    this.connector.removeListener("connected", this.onConnected);
    this.connector.removeListener("disconnect", this.onDisconnect);
    this.connector.removeListener("change", this.onChange);
  }
}
