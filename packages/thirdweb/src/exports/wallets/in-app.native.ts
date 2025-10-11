// --- KEEEP IN SYNC with exports/wallets/in-app.ts ---

export { executedEvent } from "../../extensions/erc7702/__generated__/MinimalAccount/events/Executed.js";
export { sessionCreatedEvent } from "../../extensions/erc7702/__generated__/MinimalAccount/events/SessionCreated.js";
export { valueReceivedEvent } from "../../extensions/erc7702/__generated__/MinimalAccount/events/ValueReceived.js";
// ERC7702 generated helpers
export {
  eip712Domain,
  isEip712DomainSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/read/eip712Domain.js";
export {
  type GetCallPoliciesForSignerParams,
  getCallPoliciesForSigner,
  isGetCallPoliciesForSignerSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/read/getCallPoliciesForSigner.js";
export {
  type GetSessionExpirationForSignerParams,
  getSessionExpirationForSigner,
  isGetSessionExpirationForSignerSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/read/getSessionExpirationForSigner.js";
export {
  type GetSessionStateForSignerParams,
  getSessionStateForSigner,
  isGetSessionStateForSignerSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/read/getSessionStateForSigner.js";
export {
  type GetTransferPoliciesForSignerParams,
  getTransferPoliciesForSigner,
  isGetTransferPoliciesForSignerSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/read/getTransferPoliciesForSigner.js";
export {
  type IsWildcardSignerParams,
  isIsWildcardSignerSupported,
  isWildcardSigner,
} from "../../extensions/erc7702/__generated__/MinimalAccount/read/isWildcardSigner.js";
export {
  type CreateSessionWithSigParams,
  createSessionWithSig,
  isCreateSessionWithSigSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/write/createSessionWithSig.js";
export {
  type ExecuteParams,
  execute,
  isExecuteSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/write/execute.js";
export {
  type ExecuteWithSigParams,
  executeWithSig,
  isExecuteWithSigSupported,
} from "../../extensions/erc7702/__generated__/MinimalAccount/write/executeWithSig.js";
//ACCOUNT
export {
  type CreateSessionKeyOptions,
  createSessionKey,
  isCreateSessionKeySupported,
} from "../../extensions/erc7702/account/createSessionKey.js";
export type {
  Condition,
  LimitType,
} from "../../extensions/erc7702/account/types.js";
export type {
  GetAuthenticatedUserParams,
  MultiStepAuthArgsType,
  SingleStepAuthArgsType,
} from "../../wallets/in-app/core/authentication/types.js";
export type {
  InAppWalletAuth,
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
  InAppWalletCreationOptions,
  InAppWalletSocialAuth,
} from "../../wallets/in-app/core/wallet/types.js";
export {
  authenticate,
  getProfiles,
  getUserEmail,
  getUserPhoneNumber,
  linkProfile,
  preAuthenticate,
  unlinkProfile,
} from "../../wallets/in-app/native/auth/index.js";
export { hasStoredPasskey } from "../../wallets/in-app/native/auth/passkeys.js";
export { inAppWallet } from "../../wallets/in-app/native/in-app.js";
