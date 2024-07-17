export { smartWallet } from "../../wallets/smart/smart-wallet.js";

export {
  waitForUserOpReceipt,
  createUnsignedUserOp,
  signUserOp,
} from "../../wallets/smart/lib/userop.js";

export {
  getUserOpReceipt,
  getUserOpReceiptRaw,
  bundleUserOp,
  getUserOpGasFees,
  estimateUserOpGas,
} from "../../wallets/smart/lib/bundler.js";

export { predictAddress } from "../../wallets/smart/lib/calls.js";

export { getPaymasterAndData } from "../../wallets/smart/lib/paymaster.js";

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
