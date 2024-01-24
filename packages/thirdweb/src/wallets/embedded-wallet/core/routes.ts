import type { AuthMethodType } from "./authentication.type.js";
import { getBaseUrl } from "./base-url.js";

export const ROUTE_FETCH_USER = () => `${getBaseUrl()}/v2/user/me`;
export const ROUTE_FETCH_USER_WALLETS = () => `${getBaseUrl()}/v2/user/wallets`;

export const ROUTE_LOGOUT = () => `${getBaseUrl()}/v2/logout`;
export const ROUTE_INITIATE_AUTH = (
  provider: AuthMethodType,
  clientId: string,
  autoLinkAccount?: boolean,
) => {
  const url = new URL(`${getBaseUrl()}/v2/login/${provider}`);
  url.searchParams.set("clientId", clientId);
  url.searchParams.set("autoLinkAccount", (autoLinkAccount ?? true).toString());
  return url.href;
};
export const ROUTE_COMPLETE_AUTH = (provider: AuthMethodType) =>
  `${getBaseUrl()}/v2/login/${provider}/callback`;

export const ROUTE_INITIATE_2FA_AUTH = (provider: AuthMethodType) =>
  `${getBaseUrl()}/v2/2fa/${provider}`;

export const ROUTE_STORAGE = ({
  type,
  uniqueId,
  walletId,
}: {
  uniqueId: string;
  type: "basic" | "encrypted";
  walletId: string;
}) => {
  const url = new URL(`${getBaseUrl()}/v2/storage`);
  url.searchParams.set("uniqueId", uniqueId);
  url.searchParams.set("type", type);
  url.searchParams.set("walletId", walletId);
  return url.href;
};
export const ROUTE_NEW_STORAGE = () => `${getBaseUrl()}/v2/storage/new`;
