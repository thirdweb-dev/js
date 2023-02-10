import { PaperChainMap } from "../connectors/email";
import type { PaperWalletConnector } from "../connectors/email";
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
  #connector?: PaperWalletConnector;

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
      const chainName = PaperChainMap[this.options.chainId];
      if (!chainName) {
        throw new Error("Unsupported chain id: " + this.options.chainId);
      }
      const { PaperWalletConnector } = await import("../connectors/email");
      this.#connector = new PaperWalletConnector({
        clientId: this.options.clientId,
        chain: chainName,
      });
    }
    return this.#connector;
  }
}
