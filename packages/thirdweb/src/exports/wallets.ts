export {
  createWallet,
  smartWallet,
  embeddedWallet,
} from "../wallets/create-wallet.js";

export type { Wallet, Account } from "../wallets/interfaces/wallet.js";
export type { WalletEventListener } from "../wallets/interfaces/listeners.js";
export type { WalletMetadata } from "../wallets/types.js";

export type { ConnectionStatus } from "../wallets/manager/index.js";
export { createConnectionManager } from "../wallets/manager/index.js";

export {
  getWalletBalance,
  type GetWalletBalanceOptions,
} from "../wallets/utils/getWalletBalance.js";

// private-key
export {
  privateKeyAccount,
  privateKeyToAccount,
  type PrivateKeyAccountOptions,
} from "../wallets/private-key.js";

// injected
export { getMIPDStore } from "../wallets/injected/mipdStore.js";

export { injectedProvider } from "../wallets/injected/mipdStore.js";

export {
  getStoredActiveWalletId,
  getStoredConnectedWalletIds,
} from "../wallets/manager/index.js";
