import { AbstractClientWallet, WalletOptions } from "./base";
import type { ConnectParams } from "../interfaces/connector";
import type {
  SmartWalletConfig,
  SmartWalletConnectionArgs,
} from "../connectors/smart-wallet/types";
import type { SmartWalletConnector as SmartWalletConnectorType } from "../connectors/smart-wallet";
import { Transaction, TransactionResult } from "@thirdweb-dev/sdk";
import { walletIds } from "../constants/walletIds";
import {
  IWalletConnectReceiver,
  NoOpWalletConnectReceiver,
} from "../../core/WalletConnect/IWalletConnectReceiver";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { WalletConnectV2Receiver } from "../../core/WalletConnect/WalletConnectV2Receiver";
import { AbstractWallet } from "./abstract";

// export types and utils for convenience
export * from "../connectors/smart-wallet/types";
export * from "../connectors/smart-wallet/utils";

export class SmartWallet
  extends AbstractClientWallet<SmartWalletConfig, SmartWalletConnectionArgs>
  implements IWalletConnectReceiver
{
  connector?: SmartWalletConnectorType;

  public enableConnectApp: boolean = false;
  #wcReceiver: IWalletConnectReceiver;

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

    this.enableConnectApp = options?.enableConnectApp || false;

    this.#wcReceiver = this.enableConnectApp
      ? new WalletConnectV2Receiver({
          onSessionProposal: this.#onSessionProposal,
          onSessionRequest: this.#onSessionRequest,
          walletConnectV2Metadata: options?.walletConnectV2Metadata,
          walletConenctV2ProjectId: options?.walletConenctV2ProjectId,
          walletConnectV2RelayUrl: options?.walletConnectV2RelayUrl,
        })
      : new NoOpWalletConnectReceiver();
  }

  async getConnector(): Promise<SmartWalletConnectorType> {
    if (!this.connector) {
      if (this.enableConnectApp) {
        await (this.#wcReceiver as WalletConnectV2Receiver)?.init();
      }

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

  // wcv2
  async connectApp(uri: string) {
    if (!this.enableConnectApp) {
      throw new Error("enableConnectApp is set to false in this wallet config");
    }

    this.#wcReceiver?.connectApp(uri);
  }

  approveSession(
    wallet: AbstractWallet,
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ): Promise<void> {
    return this.#wcReceiver.approveSession(wallet, proposal);
  }

  rejectSession(proposal: SignClientTypes.EventArguments["session_proposal"]) {
    return this.#wcReceiver.rejectSession(proposal);
  }

  approveEIP155Request(
    wallet: AbstractWallet,
    requestEvent: SignClientTypes.EventArguments["session_request"],
  ) {
    return this.#wcReceiver.approveEIP155Request(wallet, requestEvent);
  }
  rejectEIP155Request(
    request: SignClientTypes.EventArguments["session_request"],
  ) {
    return this.#wcReceiver.rejectEIP155Request(request);
  }

  // wc receiver
  #onSessionProposal = async (
    proposal: SignClientTypes.EventArguments["session_proposal"],
  ) => {
    this.emit("message", { type: "session_proposal", data: proposal });
  };

  #onSessionRequest = async (
    request: SignClientTypes.EventArguments["session_request"],
    session: SessionTypes.Struct,
  ) => {
    this.emit("message", {
      type: "session_proposal",
      data: { request, session },
    });
  };
}
