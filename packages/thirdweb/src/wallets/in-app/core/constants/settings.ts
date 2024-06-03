/**
 * @internal
 */
export const IN_APP_WALLET_PATH = "/sdk/2022-08-12/embedded-wallet";

/**
 * @internal
 */
export const HEADLESS_GOOGLE_OAUTH_ROUTE =
  "/auth/headless-google-login-managed";

/**
 * @internal
 */
export const BASE_IN_APP_WALLET_URL = "embedded-wallet.thirdweb.com";

// STORAGE

/**
 * @internal
 */
export const WALLET_USER_DETAILS_LOCAL_STORAGE_NAME = (clientId: string) =>
  `thirdwebEwsWalletUserDetails-${clientId}`;

/**
 * @internal
 */
export const WALLET_USER_ID_LOCAL_STORAGE_NAME = (clientId: string) =>
  `thirdwebEwsWalletUserId-${clientId}`;

/**
 * @internal
 */
const AUTH_TOKEN_LOCAL_STORAGE_PREFIX = "walletToken";

/**
 * @internal
 */
export const AUTH_TOKEN_LOCAL_STORAGE_NAME = (clientId: string) => {
  return `${AUTH_TOKEN_LOCAL_STORAGE_PREFIX}-${clientId}`;
};

/**
 * @internal
 */
export const PASSKEY_CREDENTIAL_ID_LOCAL_STORAGE_NAME = (clientId: string) => {
  return `passkey-credential-id-${clientId}`;
};

/**
 * @internal
 */
const DEVICE_SHARE_LOCAL_STORAGE_PREFIX = "a";

/**
 * @internal
 */
export const DEVICE_SHARE_LOCAL_STORAGE_NAME = (
  clientId: string,
  userId: string,
) => `${DEVICE_SHARE_LOCAL_STORAGE_PREFIX}-${clientId}-${userId}`;

/**
 * @internal
 */
export const WALLET_CONNECT_SESSIONS_LOCAL_STORAGE_NAME = (clientId: string) =>
  `walletConnectSessions-${clientId}`;

/**
 * @internal
 */
export const DEVICE_SHARE_LOCAL_STORAGE_NAME_DEPRECATED = (clientId: string) =>
  `${DEVICE_SHARE_LOCAL_STORAGE_PREFIX}-${clientId}`;
