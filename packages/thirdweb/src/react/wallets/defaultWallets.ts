import type { WalletConfig } from "../types/wallets.js";
import { coinbaseConfig } from "./coinbase/coinbaseConfig.js";
import { embeddedWalletConfig } from "./embedded/embeddedWalletConfig.js";
import { metamaskConfig } from "./metamask/metamaskConfig.js";
import { rainbowConfig } from "./rainbow/rainbowConfig.js";
import { walletConnectConfig } from "./walletConnect/walletConnectConfig.js";
import { zerionConfig } from "./zerion/zerionConfig.js";

export const defaultWallets: WalletConfig[] = [
  /* @__PURE__ */ embeddedWalletConfig(),
  /* @__PURE__ */ metamaskConfig(),
  /* @__PURE__ */ coinbaseConfig(),
  /* @__PURE__ */ walletConnectConfig(),
  /* @__PURE__ */ rainbowConfig(),
  /* @__PURE__ */ zerionConfig(),
];
