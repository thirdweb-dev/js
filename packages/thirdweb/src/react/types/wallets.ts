import { type Wallet } from "../../wallets/index.js";

export type WalletConfig = {
  createWallet: (options?: { autoConnect?: boolean }) => Promise<Wallet>;
  id: string;
};
