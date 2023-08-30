export const EMBEDDED_WALLET_PATH = "/sdk/2022-08-12/embedded-wallet";

export const WALLET_USER_DETAILS_LOCAL_STORAGE_NAME = (clientId: string) =>
  `thirdwebEwsWalletUserDetails-${clientId}`;
export const WALLET_USER_ID_LOCAL_STORAGE_NAME = (clientId: string) =>
  `thirdwebEwsWalletUserId-${clientId}`;
const AUTH_TOKEN_LOCAL_STORAGE_PREFIX = "walletToken";
export const AUTH_TOKEN_LOCAL_STORAGE_NAME = (clientId: string) => {
  return `${AUTH_TOKEN_LOCAL_STORAGE_PREFIX}-${clientId}`;
};
const DEVICE_SHARE_LOCAL_STORAGE_PREFIX = "a";
export const DEVICE_SHARE_LOCAL_STORAGE_NAME = (
  clientId: string,
  userId: string,
) => `${DEVICE_SHARE_LOCAL_STORAGE_PREFIX}-${clientId}-${userId}`;
export const DEVICE_SHARE_LOCAL_STORAGE_NAME_DEPRECATED = (clientId: string) =>
  `${DEVICE_SHARE_LOCAL_STORAGE_PREFIX}-${clientId}`;
