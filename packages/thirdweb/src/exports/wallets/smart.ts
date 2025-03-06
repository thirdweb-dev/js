export { smartWallet } from "../../wallets/smart/smart-wallet.js";

export {
  waitForUserOpReceipt,
  createUnsignedUserOp,
  signUserOp,
  createAndSignUserOp,
  getUserOpHash,
} from "../../wallets/smart/lib/userop.js";

export {
  getUserOpReceipt,
  getUserOpReceiptRaw,
  bundleUserOp,
  getUserOpGasFees,
  estimateUserOpGas,
  estimateUserOpGasCost,
} from "../../wallets/smart/lib/bundler.js";

export {
  predictAddress,
  predictSmartAccountAddress,
} from "../../wallets/smart/lib/calls.js";

export { getPaymasterAndData } from "../../wallets/smart/lib/paymaster.js";
export { getZkPaymasterData } from "../../wallets/smart/lib/bundler.js";

export type {
  SmartWalletConnectionOptions,
  SmartWalletOptions,
  UserOperationV06 as UserOperation,
  PaymasterResult,
} from "../../wallets/smart/types.js";

// all preset configs
export * as Config from "../../wallets/smart/presets/index.js";

export {
  ENTRYPOINT_ADDRESS_v0_6,
  ENTRYPOINT_ADDRESS_v0_7,
  DEFAULT_ACCOUNT_FACTORY_V0_6,
  DEFAULT_ACCOUNT_FACTORY_V0_7,
  TokenPaymaster,
} from "../../wallets/smart/lib/constants.js";
