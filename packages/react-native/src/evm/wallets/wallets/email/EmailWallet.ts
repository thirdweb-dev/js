import {
  WalletOptions,
  PaperWalletAdditionalOptions,
  AbstractClientWallet,
} from "@thirdweb-dev/wallets";
import type { EmailWalletConnector as EmailConnectorType } from "../../connectors/email-wallet/email-connector";
import { EmailWalletConnectionArgs } from "../../connectors/email-wallet/types";
import { EmailWalletConnector } from "../../connectors/email-wallet/email-connector";

export type EmailWalletOptions = WalletOptions<PaperWalletAdditionalOptions>;

export class EmailWallet extends AbstractClientWallet<
  EmailWalletOptions,
  EmailWalletConnectionArgs
> {
  connector?: EmailConnectorType;
  options: EmailWalletOptions;

  static meta = {
    name: "Email Wallet",
    iconURL: "https://thirdweb.com/favicon.ico",
  };

  static id = "email-wallet";

  constructor(options: EmailWalletOptions) {
    super(EmailWallet.id, options);

    this.options = options;

    this.initializeConnector();

    this.setupListeners();
  }

  async getConnector(): Promise<EmailConnectorType> {
    if (!this.connector) {
      return await this.initializeConnector();
    }
    return this.connector;
  }

  // my methods

  initializeConnector() {
    this.connector = new EmailWalletConnector({
      ...this.options,
      clientId: this.options.paperClientId,
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
