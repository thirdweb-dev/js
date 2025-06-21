export { create7702MinimalAccount } from "../../wallets/in-app/core/eip7702/minimal-account.js";
export {
  bundleUserOp,
  estimateUserOpGas,
  estimateUserOpGasCost,
  getUserOpGasFees,
  getUserOpReceipt,
  getUserOpReceiptRaw,
  getZkPaymasterData,
} from "../../wallets/smart/lib/bundler.js";

export {
  predictAddress,
  predictSmartAccountAddress,
} from "../../wallets/smart/lib/calls.js";
export {
  DEFAULT_ACCOUNT_FACTORY_V0_6,
  DEFAULT_ACCOUNT_FACTORY_V0_7,
  ENTRYPOINT_ADDRESS_v0_6,
  ENTRYPOINT_ADDRESS_v0_7,
  TokenPaymaster,
} from "../../wallets/smart/lib/constants.js";
export { getPaymasterAndData } from "../../wallets/smart/lib/paymaster.js";
export {
  createAndSignUserOp,
  createUnsignedUserOp,
  getUserOpHash,
  prepareUserOp,
  signUserOp,
  waitForUserOpReceipt,
} from "../../wallets/smart/lib/userop.js";

// all preset configs
export * as Config from "../../wallets/smart/presets/index.js";
export { smartWallet } from "../../wallets/smart/smart-wallet.js";
export type {
  PaymasterResult,
  SmartWalletConnectionOptions,
  SmartWalletOptions,
  UserOperationV06 as UserOperation,
} from "../../wallets/smart/types.js";
