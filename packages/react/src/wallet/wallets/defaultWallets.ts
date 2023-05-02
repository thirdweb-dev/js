import { coinbaseWallet } from "./coinbaseWallet";
import { metamaskWallet } from "./metamaskWallet";
import { walletConnectV1 } from "./walletConnectV1";

export const defaultWallets = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnectV1(),
];
