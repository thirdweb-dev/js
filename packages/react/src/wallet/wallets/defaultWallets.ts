import { WalletConfig } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbase/coinbaseWallet";
import { metamaskWallet } from "./metamask/metamaskWallet";
import { walletConnect } from "./walletConnect/walletConnect";
import { trustWallet } from "./trustWallet/TrustWallet";
import { zerionWallet } from "./zerion/zerionWallet";
import { rainbowWallet } from "./rainbow/RainbowWallet";
import { phantomWallet } from "./phantom/phantomWallet";

export const defaultWallets: WalletConfig<any>[] = /* @__PURE__ */ (() => [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnect(),
  trustWallet(),
  rainbowWallet(),
  zerionWallet(),
  phantomWallet(),
])();
