import {
  metamaskWallet,
  rainbowWallet,
  zerionWallet,
} from "../../wallets/index.js";
import type { WalletConfig } from "../types/wallets.js";

export const defaultWallets: WalletConfig[] = [
  {
    id: "metamask",
    createWallet: metamaskWallet,
  },
  {
    id: "rainbow",
    createWallet: rainbowWallet,
  },
  {
    id: "zerion",
    createWallet: zerionWallet,
  },
];
