import { type Wallet } from "../../wallets/index.js";

export type WalletConfig = {
  createWallet: (options?: { silent?: boolean }) => Promise<Wallet>;
  id: string;
};
