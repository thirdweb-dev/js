import { WalletConfig } from "@thirdweb-dev/react-core";
import { coinbaseWallet } from "./coinbase/coinbaseWallet";
import { metamaskWallet } from "./metamask/metamaskWallet";
import { walletConnect } from "./walletConnect/walletConnect";
import { trustWallet } from "./trustWallet/TrustWallet";
import { zerionWallet } from "./zerion/zerionWallet";
import { rainbowWallet } from "./rainbow/RainbowWallet";
import { phantomWallet } from "./phantom/phantomWallet";

/**
 * The default wallets that are used by the `ThirdwebProvider` if no `supportedWallets` prop is provided.
 *
 * The defaults wallets are:
 * - Metamask
 * - Coinbase
 * - WalletConnect
 * - TrustWallet
 * - RainbowWallet
 * - ZerionWallet
 * - PhantomWallet
 */
export const defaultWallets: WalletConfig<any>[] = /* @__PURE__ */ (() => [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnect(),
  trustWallet(),
  rainbowWallet(),
  zerionWallet(),
  phantomWallet(),
])();
