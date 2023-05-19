import { AbstractClientWallet, WalletOptions } from "./base";
import type { ConnectParams } from "../interfaces/connector";
import type {
  SmartWalletConfig,
  SmartWalletConnectionArgs,
} from "../connectors/smart-wallet/types";
import type { SmartWalletConnector as SmartWalletConnectorType } from "../connectors/smart-wallet";
import { Transaction, TransactionResult } from "@thirdweb-dev/sdk";
import { walletIds } from "../constants/walletIds";

// export types and utils for convenience
export * from "../connectors/smart-wallet/types";
export * from "../connectors/smart-wallet/utils";
export type { PaymasterAPI } from "@account-abstraction/sdk";

export class SmartWallet extends AbstractClientWallet<
  SmartWalletConfig,
  SmartWalletConnectionArgs
> {
  connector?: SmartWalletConnectorType;

  static meta = {
    name: "Smart Wallet",
    iconURL:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
  };

  static id = walletIds.smartWallet;
  public get walletName() {
    return "Smart Wallet" as const;
  }

  constructor(options: WalletOptions<SmartWalletConfig>) {
    super(SmartWallet.id, {
      ...options,
    });
  }

  async getConnector(): Promise<SmartWalletConnectorType> {
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

  async execute(transaction: Transaction): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.execute(transaction);
  }

  async executeBatch(transactions: Transaction[]): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeBatch(transactions);
  }

  autoConnect(params: ConnectParams<SmartWalletConnectionArgs>) {
    return this.connect(params);
  }
}
