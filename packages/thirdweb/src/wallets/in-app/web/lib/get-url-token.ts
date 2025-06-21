import type { AuthOption } from "../../../../wallets/types.js";
import type { WalletId } from "../../../wallet-types.js";
import type { AuthStoredTokenWithCookieReturnType } from "../../core/authentication/types.js";

/**
 * Checks for an auth token and associated metadata in the current URL
 */
export function getUrlToken():
  | {
      walletId?: WalletId;
      authResult?: AuthStoredTokenWithCookieReturnType;
      authProvider?: AuthOption;
      authCookie?: string;
    }
  | undefined {
  if (typeof document === "undefined") {
    // Not in web
    return undefined;
  }

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const authResultString = params.get("authResult");
  const walletId = params.get("walletId") as WalletId | undefined;
  const authProvider = params.get("authProvider") as AuthOption | undefined;
  const authCookie = params.get("authCookie") as string | undefined;

  if ((authCookie || authResultString) && walletId) {
    const authResult = (() => {
      if (authResultString) {
        params.delete("authResult");
        return JSON.parse(decodeURIComponent(authResultString));
      }
    })();
    params.delete("walletId");
    params.delete("authProvider");
    params.delete("authCookie");
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
    return { authCookie, authProvider, authResult, walletId };
  }
  return undefined;
}
