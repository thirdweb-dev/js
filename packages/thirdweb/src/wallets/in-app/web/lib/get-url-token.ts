import type { AuthOption } from "../../../../wallets/types.js";
import type { WalletId } from "../../../wallet-types.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../core/authentication/type.js";

/**
 * Checks for an auth token and associated metadata in the current URL
 */
export function getUrlToken(): {
  walletId?: WalletId;
  authResult?: AuthStoredTokenWithCookieReturnType;
  authProvider?: AuthOption;
} {
  if (!window) {
    throw new Error("Attempted to fetch a URL token on the server");
  }

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const authResultString = params.get("authResult");
  const walletId = params.get("walletId") as WalletId | undefined;
  const authProvider = params.get("authProvider") as AuthOption | undefined;

  if (authResultString && walletId) {
    const authResult = JSON.parse(authResultString);
    params.delete("authResult");
    params.delete("walletId");
    params.delete("authProvider");
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    return { walletId, authResult, authProvider };
  }
  return {};
}
