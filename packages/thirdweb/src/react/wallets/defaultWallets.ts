import type { WalletConfig } from "../types/wallets.js";
import { metamaskConfig } from "./metamask/metamaskWallet.js";

export const defaultWallets: WalletConfig[] = [
  /* @__PURE__ */ metamaskConfig(),
];
