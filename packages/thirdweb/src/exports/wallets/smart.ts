export { smartWallet } from "../../wallets/smart/smart-wallet.js";

export { waitForUserOpReceipt } from "../../wallets/smart/lib/userop.js";

export type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
  UserOperation,
  PaymasterResult,
} from "../../wallets/smart/types.js";

export {
  ENTRYPOINT_ADDRESS_v0_6,
  DEFAULT_ACCOUNT_FACTORY,
} from "../../wallets/smart/lib/constants.js";
