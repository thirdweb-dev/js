import { AbstractClientWallet, WalletOptions } from "./base";
import type { TWConnector } from "../interfaces/tw-connector";
import type {
  SmartWalletConfig,
  SmartWalletConnectionArgs,
} from "../connectors/smart-wallet/types";
import type { SmartWalletConnector as SmartWalletConnectorType } from "../connectors/smart-wallet";

// export types and utils for convenience
export * from "../connectors/smart-wallet/types";
export * from "../connectors/smart-wallet/utils";

export class SmartWallet extends AbstractClientWallet<
  SmartWalletConfig,
  SmartWalletConnectionArgs
> {
  connector?: SmartWalletConnectorType;

  static meta = {
    name: "SmartWallet",
    iconURL:
      "ipfs://QmPSPvHvYWh9BfvLLPDHjVoCuJTd2hSMSgF3N6JCrjuX4v/SmartWallet.svg",
  };

  static id = "SmartWallet" as const;
  public get walletName() {
    return "Smart Wallet" as const;
  }

  constructor(options: WalletOptions<SmartWalletConfig>) {
    super(SmartWallet.id, {
      ...options,
    });
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      const { SmartWalletConnector } = await import(
        "../connectors/smart-wallet"
      );
      this.connector = new SmartWalletConnector(
        this.options as SmartWalletConfig,
      );
    }
    return this.connector;
  }

  getPersonalWallet() {
    return this.connector?.personalWallet;
  }
}
