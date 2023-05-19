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
  WCSession,
  WalletConnectHandler,
  WCProposal,
  WCRequest,
  IWalletConnectReceiver,
  WalletConnectReceiverConfig,
} from "../../core/types/walletConnect";
import { WalletConnectV2Handler } from "../../core/WalletConnect/WalletConnectV2Handler";
import { NoOpWalletConnectHandler } from "../../core/WalletConnect/constants";
import { WalletConnectV1Handler } from "../../core/WalletConnect/WalletConnectV1Handler";
import { createLocalStorage } from "../../core";

// export types and utils for convenience
export * from "../connectors/smart-wallet/types";
export * from "../connectors/smart-wallet/utils";

export class SmartWallet
  extends AbstractClientWallet<SmartWalletConfig, SmartWalletConnectionArgs>
  implements IWalletConnectReceiver
{
  connector?: SmartWalletConnectorType;

  public enableConnectApp: boolean = false;
  #enableWalletConnectV1: WalletConnectReceiverConfig["wcVersion"];
  #wcWallet: WalletConnectHandler;

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

    console.log("enable connect app", options.enableConnectApp);

    this.enableConnectApp = options?.enableConnectApp || false;
    this.#wcWallet = this.enableConnectApp
      ? options?.wcVersion === "v1"
        ? new WalletConnectV1Handler({
            walletConnectV2Metadata: options?.walletConnectV2Metadata,
            walletConenctV2ProjectId: options?.walletConenctV2ProjectId,
            walletConnectV2RelayUrl: options?.walletConnectV2RelayUrl,
            storage: options?.wcStorage || createLocalStorage("smart-wallet"),
          })
        : new WalletConnectV2Handler({
            walletConnectV2Metadata: options?.walletConnectV2Metadata,
            walletConenctV2ProjectId: options?.walletConenctV2ProjectId,
            walletConnectV2RelayUrl: options?.walletConnectV2RelayUrl,
          })
      : new NoOpWalletConnectHandler();
  }

  async getConnector(): Promise<SmartWalletConnectorType> {
    if (!this.connector) {
      if (this.enableConnectApp) {
        await this.#wcWallet.init();

        this.#setupWalletConnectEventsListeners();
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

    this.#wcWallet?.connectApp(uri);
  }

  approveSession(): Promise<void> {
    return this.#wcWallet.approveSession(this);
  }

  rejectSession() {
    return this.#wcWallet.rejectSession();
  }

  approveRequest() {
    return this.#wcWallet.approveEIP155Request(this);
  }

  rejectRequest() {
    return this.#wcWallet.rejectEIP155Request();
  }

  getActiveSessions(): WCSession[] {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    return this.#wcWallet.getActiveSessions();
  }

  disconnectSession(): Promise<void> {
    return this.#wcWallet?.disconnectSession();
  }

  #setupWalletConnectEventsListeners() {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    this.#wcWallet.on("session_proposal", (proposal: WCProposal) => {
      console.log("smart-wallet.proposal");

      this.emit("message", {
        type: "session_proposal",
        data: proposal,
      });
    });

    this.#wcWallet.on("session_delete", () => {
      console.log("smart-wallet.session_delete");

      this.emit("message", { type: "session_delete" });
    });

    this.#wcWallet.on("switch_chain", (request: WCRequest) => {
      console.log("smart-wallet.switch_chain");

      const chainId = request.params[0].chainId;

      this.emit("message", {
        type: "switch_chain",
        data: { chainId },
      });

      this.#wcWallet.disconnectSession();
    });

    this.#wcWallet.on("session_request", (request: WCRequest) => {
      console.log("smart-wallet.request", request);

      this.emit("message", {
        type: "session_request",
        data: request,
      });
    });
  }
}
