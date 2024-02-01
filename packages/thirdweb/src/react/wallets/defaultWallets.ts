import type { WalletConfig } from "../types/wallets.js";
import { metamaskConfig } from "./metamask/metamaskConfig.js";
import { rainbowConfig } from "./rainbow/rainbowConfig.js";
import { zerionConfig } from "./zerion/zerionConfig.js";

export const defaultWallets: WalletConfig[] = [
  /* @__PURE__ */ metamaskConfig(),
  /* @__PURE__ */ zerionConfig(),
  /* @__PURE__ */ rainbowConfig(),
];
