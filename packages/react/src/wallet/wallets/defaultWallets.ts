import { Wallet } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbaseWallet";
import { metamaskWallet } from "./metamaskWallet";
import { walletConnectV1 } from "./walletConnectV1";

export const defaultWallets: Wallet[] = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnectV1(),
];
