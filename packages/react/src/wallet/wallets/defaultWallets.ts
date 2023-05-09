import { ConfiguredWallet } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbase/coinbaseWallet";
import { metamaskWallet } from "./metamask/metamaskWallet";
import { walletConnectV1 } from "./walletConnectV1";

export const defaultWallets: ConfiguredWallet[] = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnectV1(),
];
