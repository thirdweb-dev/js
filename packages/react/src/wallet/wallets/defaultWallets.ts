import { WalletConfig } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbase/coinbaseWallet";
import { metamaskWallet } from "./metamask/metamaskWallet";
import { walletConnectV1 } from "./walletConnectV1";

export const defaultWallets: WalletConfig<any>[] = /* @__PURE__ */ (() => [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnectV1(),
])();
