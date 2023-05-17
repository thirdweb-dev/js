import { AbstractWallet } from "../../evm/wallets/abstract";
import { WCSession, WalletConnectWallet } from "../types/walletConnect";

export class NoOpWalletConnectReceiver extends WalletConnectWallet {
  init() {
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connectApp(uri: string): Promise<void> {
    return Promise.resolve();
  }
  approveSession(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wallet: AbstractWallet,
  ): Promise<void> {
    return Promise.resolve();
  }
  rejectSession(): Promise<void> {
    return Promise.resolve();
  }
  approveEIP155Request(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wallet: AbstractWallet,
  ): Promise<void> {
    return Promise.resolve();
  }
  rejectEIP155Request(): Promise<void> {
    return Promise.resolve();
  }

  getActiveSessions(): WCSession[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disconnectSession(): Promise<void> {
    return Promise.resolve();
  }
}
