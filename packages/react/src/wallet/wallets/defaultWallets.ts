import { WalletConfig } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbase/coinbaseWallet";
import { metamaskWallet } from "./metamask/metamaskWallet";
import { walletConnectV1 } from "./walletConnectV1";
import { zerionWallet } from "./zerion/zerionWallet";

export const defaultWallets: WalletConfig<any>[] = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnectV1(),
  zerionWallet(),
];
