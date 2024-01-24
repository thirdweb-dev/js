import type { AuthMethodType } from "./authentication.type.js";
import { getBaseUrl } from "./base-url.js";

// eslint-disable-next-line better-tree-shaking/no-top-level-side-effects
export const ROUTE_FETCH_USER = `${getBaseUrl()}/v2/user/me`;
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
