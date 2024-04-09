export {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME_DEPRECATED,
  WALLET_USER_DETAILS_LOCAL_STORAGE_NAME,
  WALLET_USER_ID_LOCAL_STORAGE_NAME,
} from "./constants/settings.js";
export { AuthProvider, RecoveryShareManagement } from "./interfaces/auth.js";
export type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  StoredTokenType,
  GetHeadlessLoginLinkReturnType,
} from "./interfaces/auth.js";
export { UserWalletStatus } from "./interfaces/in-app-wallets/in-app-wallets.js";
export type {
  AuthDetails,
  InAppWalletConstructorType,
  GetAuthDetailsReturnType,
  GetUser,
  GetUserWalletStatusRpcReturnType,
  InitializedUser,
  LogoutReturnType,
  SendEmailOtpReturnType,
  SetUpWalletRpcReturnType,
} from "./interfaces/in-app-wallets/in-app-wallets.js";
export type {
  GetAddressReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
  SignedTypedDataReturnType,
} from "./interfaces/in-app-wallets/signer.js";
export { InAppWalletSdk } from "./lib/in-app-wallet.js";
