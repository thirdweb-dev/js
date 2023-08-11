import { AbstractClientWallet, WalletOptions } from "./base";
import type { ConnectParams } from "../interfaces/connector";
import type {
  SmartWalletConfig,
  SmartWalletConnectionArgs,
} from "../connectors/smart-wallet/types";
import type { SmartWalletConnector as SmartWalletConnectorType } from "../connectors/smart-wallet";
import {
  Transaction,
  TransactionResult,
  SmartContract,
} from "@thirdweb-dev/sdk";
import { walletIds } from "../constants/walletIds";
import {
  WCSession,
  WalletConnectHandler,
  WCProposal,
  WCRequest,
  IWalletConnectReceiver,
} from "../../core/types/walletConnect";
import { WalletConnectV2Handler } from "../../core/WalletConnect/WalletConnectV2Handler";
import { NoOpWalletConnectHandler } from "../../core/WalletConnect/constants";

// export types and utils for convenience
export * from "../connectors/smart-wallet/types";
export * from "../connectors/smart-wallet/utils";
export type { PaymasterAPI } from "@account-abstraction/sdk";

export class SmartWallet
  extends AbstractClientWallet<SmartWalletConfig, SmartWalletConnectionArgs>
  implements IWalletConnectReceiver
{
  connector?: SmartWalletConnectorType;

  public enableConnectApp: boolean = false;
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

    this.enableConnectApp = options?.enableConnectApp || false;
    this.#wcWallet = this.enableConnectApp
      ? new WalletConnectV2Handler({
          walletConnectWalletMetadata: options?.walletConnectWalletMetadata,
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

  /**
   * Check whether the connected signer can execute a given transaction using the smart wallet.
   * @param transaction the transaction to execute using the smart wallet.
   * @returns whether the connected signer can execute the transaction using the smart wallet.
   */
  async hasPermissionToExecute(transaction: Transaction): Promise<boolean> {
    const connector = await this.getConnector();
    return connector.hasPermissionToExecute(transaction);
  }

  /**
   * Execute a single transaction
   * @param transactions
   * @returns the transaction receipt
   */
  async execute(transaction: Transaction): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.execute(transaction);
  }

  /**
   * Execute multiple transactions in a single batch
   * @param transactions
   * @returns the transaction receipt
   */
  async executeBatch(transactions: Transaction[]): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.executeBatch(transactions);
  }

  /**
   * Manually deploy the smart wallet contract. If already deployed this will throw an error.
   * Note that this is not necessary as the smart wallet will be deployed automatically on the first transaction the user makes.
   * @returns the transaction receipt
   */
  async deploy(): Promise<TransactionResult> {
    const connector = await this.getConnector();
    return connector.deploy();
  }

  /**
   * Check if the smart wallet contract is deployed
   * @returns true if the smart wallet contract is deployed
   */
  async isDeployed(): Promise<boolean> {
    const connector = await this.getConnector();
    return connector.isDeployed();
  }

  /**
   * Get the underlying account contract of the smart wallet.
   * @returns the account contract of the smart wallet.
   */
  async getAccountContract(): Promise<SmartContract> {
    const connector = await this.getConnector();
    return connector.getAccountContract();
  }

  /**
   * Get the underlying account factory contract of the smart wallet.
   * @returns the account factory contract.
   */
  async getFactoryContract(): Promise<SmartContract> {
    const connector = await this.getConnector();
    return connector.getFactoryContract();
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

  async approveSession(): Promise<void> {
    await this.#wcWallet.approveSession(this);

    this.emit("message", { type: "session_approved" });
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

  isWCReceiverEnabled() {
    return this.enableConnectApp;
  }

  #setupWalletConnectEventsListeners() {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }

    this.#wcWallet.on("session_proposal", (proposal: WCProposal) => {
      this.emit("message", {
        type: "session_proposal",
        data: proposal,
      });
    });

    this.#wcWallet.on("session_delete", () => {
      this.emit("message", { type: "session_delete" });
    });

    this.#wcWallet.on("switch_chain", (request: WCRequest) => {
      const chainId = request.params[0].chainId;

      this.emit("message", {
        type: "switch_chain",
        data: { chainId },
      });

      this.#wcWallet.disconnectSession();
    });

    this.#wcWallet.on("session_request", (request: WCRequest) => {
      this.emit("message", {
        type: "session_request",
        data: request,
      });
    });
  }
}
