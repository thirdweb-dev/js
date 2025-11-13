import type { Wallet } from "../../../../wallets/interfaces/wallet.js";

export type OnConnectCallback = (
  activeWallet: Wallet,
  allConnectedWallets: Wallet[],
) => void;
