import { SessionTypes } from "@walletconnect/types";
import { AbstractWallet } from "../../evm";
import {
  WCSession,
  WalletConnectWallet,
  WalletConnectReceiverConfig,
  WCMetadata,
} from "../types/walletConnect";
import WalletConnect from "@walletconnect/client";

type WalletConnectV1WalletConfig = Omit<
  WalletConnectReceiverConfig,
  "enableConnectApp"
>;

export class WalletConnectV1Wallet extends WalletConnectWallet {
  #wcMetadata: WCMetadata;
  #wcWallet: WalletConnect | undefined;

  constructor(options: WalletConnectV1WalletConfig) {
    super();

    this.#wcMetadata = options?.walletConnectV2Metadata || {
      name: "Thirdweb Smart Wallet",
      description: "Thirdweb Smart Wallet",
      url: "https://thirdweb.com",
      icons: ["https://thirdweb.com/favicon.ico"],
    };
  }

  init(): Promise<void> {
    return Promise.resolve();
  }

  connectApp(uri: string): Promise<void> {
    // Create connector
    this.#wcWallet = new WalletConnect({
      uri: uri,
      // Required
      clientMeta: this.#wcMetadata,
    });

    this.#setupWalletConnectEventsListeners();

    return Promise.resolve();
  }

  approveSession(wallet: AbstractWallet): Promise<void> {
    throw new Error("Method not implemented.");
  }
  rejectSession(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  approveEIP155Request(wallet: AbstractWallet): Promise<void> {
    throw new Error("Method not implemented.");
  }
  rejectEIP155Request(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getActiveSessions(): WCSession[] {
    throw new Error("Method not implemented.");
  }
  disconnectSession(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  #setupWalletConnectEventsListeners() {
    if (!this.#wcWallet) {
      throw new Error(
        "Please, init the wallet before making session requests.",
      );
    }
  }
}
