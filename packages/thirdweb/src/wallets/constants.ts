import type { WalletId } from "./wallet-types.js";

// Constants for most common wallets
export const COINBASE = "com.coinbase.wallet";
export const METAMASK = "io.metamask";
export const RAINBOW = "me.rainbow";
export const ZERION = "io.zerion.wallet";

// Wallet IDs that should not appear in searchable wallet lists
export const NON_SEARCHABLE_WALLETS: WalletId[] = [
  "inApp",
  "embedded",
  "smart",
  "xyz.abs",
];
