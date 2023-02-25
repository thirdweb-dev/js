import {
  EmailWalletConnectionArgs,
  EmailWalletOptions,
} from "../connectors/email/types";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export class EmailWallet extends AbstractBrowserWallet<
  EmailWalletOptions,
  EmailWalletConnectionArgs
> {
  #connector?: TWConnector;

  static id = "email-wallet" as const;
  public get walletName() {
    return "Email Wallet" as const;
  }

  constructor(options: WalletOptions<EmailWalletOptions>) {
    super(EmailWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.#connector) {
      const { EmailWalletConnector } = await import("../connectors/email");
      this.#connector = new EmailWalletConnector({
        clientId: this.options.clientId,
        chain: this.options.chain,
      });
    }
    return this.#connector;
  }
}
