import { WalletConfig } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbase/coinbaseWallet";
import { metamaskWallet } from "./metamask/metamaskWallet";
import { bitkeepWallet } from "./bitkeep/BitKeepWallet";
import { walletConnectV1 } from "./walletConnectV1";

export const defaultWallets: WalletConfig<any>[] = [
  metamaskWallet(),
  coinbaseWallet(),
  bitkeepWallet(),
  walletConnectV1(),
];
