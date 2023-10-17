export {
  AUTH_TOKEN_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME,
  DEVICE_SHARE_LOCAL_STORAGE_NAME_DEPRECATED,
  WALLET_USER_DETAILS_LOCAL_STORAGE_NAME,
  WALLET_USER_ID_LOCAL_STORAGE_NAME,
} from "./constants/settings";
export { AuthProvider, RecoveryShareManagement } from "./interfaces/auth";
export type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  StoredTokenType,
} from "./interfaces/auth";
export {
  UserStatus,
  UserWalletStatus,
} from "./interfaces/embedded-wallets/embedded-wallets";
export type {
  AuthDetails,
  EmbeddedWalletConstructorType,
  GetAuthDetailsReturnType,
  GetUser,
  GetUserWalletStatusRpcReturnType,
  InitializedUser,
  LogoutReturnType,
  SendEmailOtpReturnType,
  SetUpWalletRpcReturnType,
} from "./interfaces/embedded-wallets/embedded-wallets";
export type {
  GetAddressReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
  SignedTypedDataReturnType,
} from "./interfaces/embedded-wallets/signer";
export { EmbeddedWalletSdk } from "./lib/embedded-wallet";
