import { getPaperOriginUrl } from "@paperxyz/sdk-common-utilities";
/**
 * @internal
 */
export const EMBEDDED_WALLET_PATH = "/sdk/2022-08-12/embedded-wallet";

/**
 * @internal
 */
export const HEADLESS_GOOGLE_OAUTH_ROUTE = `/auth/headless-google-login-managed`;
/**
 * @internal
 */
export const GET_IFRAME_BASE_URL = () =>
  `${getPaperOriginUrl().replace(
    "withpaper.com",
    "embedded-wallet.thirdweb.com",
  )}`;
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
export const DEVICE_SHARE_LOCAL_STORAGE_NAME_DEPRECATED = (clientId: string) =>
  `${DEVICE_SHARE_LOCAL_STORAGE_PREFIX}-${clientId}`;
