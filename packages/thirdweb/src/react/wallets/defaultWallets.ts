import type { WalletConfig } from "../types/wallets.js";
import { metamaskConfig } from "./metamask/metamaskConfig.js";

export const defaultWallets: WalletConfig[] = [
  /* @__PURE__ */ metamaskConfig(),
];
