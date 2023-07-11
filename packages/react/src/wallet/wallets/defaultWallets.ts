import { WalletConfig } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbase/coinbaseWallet";
import { metamaskWallet } from "./metamask/metamaskWallet";
import { walletConnect } from "./walletConnect";

export const defaultWallets: WalletConfig<any>[] = /* @__PURE__ */ (() => [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnect(),
])();
