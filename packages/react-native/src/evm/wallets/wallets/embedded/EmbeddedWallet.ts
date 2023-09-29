import {
  WalletOptions,
  AbstractClientWallet,
  EmbeddedWalletAdditionalOptions,
  walletIds,
} from "@thirdweb-dev/wallets";
import type { EmbeddedWalletConnector as EmbeddedConnectorType } from "../../connectors/embedded-wallet/embedded-connector";
import { EmbeddedWalletConnectionArgs } from "../../connectors/embedded-wallet/types";
import { EmbeddedWalletConnector } from "../../connectors/embedded-wallet/embedded-connector";
import { EMAIL_WALLET_ICON } from "../../../assets/svgs";

export type EmbeddedWalletOptions =
  WalletOptions<EmbeddedWalletAdditionalOptions>;

export class EmbeddedWallet extends AbstractClientWallet<
  EmbeddedWalletOptions,
  EmbeddedWalletConnectionArgs
> {
  connector?: EmbeddedConnectorType;
  options: EmbeddedWalletOptions;

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

  async getConnector(): Promise<EmbeddedConnectorType> {
    if (!this.connector) {
      return await this.initializeConnector();
    }
    return this.connector;
  }

  // my methods

  initializeConnector() {
    this.connector = new EmbeddedWalletConnector({
      ...this.options,
      clientId: this.options.clientId,
      chains: this.chains,
    });

    return this.connector;
  }

  async validateEmailOTP(otp: string) {
    return this.connector?.validateEmailOtp(otp);
  }

  async sendEmailOTP(email: string) {
    return this.connector?.sendEmailOtp(email);
  }

  onConnected = () => {
    this.emit("message", { type: "connected" });
  };

  onDisconnect = () => {
    this.removeListeners();
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
