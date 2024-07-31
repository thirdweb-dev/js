import { isBrowser } from "../utils/isBrowser";

// EWS token shenaningans
const GLOBAL_EWS_AUTH_TOKEN_KEY = "TW_EWS_AUTH_TOKEN";

export function storeEWSToken(token: string): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(GLOBAL_EWS_AUTH_TOKEN_KEY, token);
}

export function getLatestEWSToken(): string | undefined {
  if (!isBrowser()) {
    return;
  }
  const token = localStorage.getItem(GLOBAL_EWS_AUTH_TOKEN_KEY);
  if (token) {
    localStorage.removeItem(GLOBAL_EWS_AUTH_TOKEN_KEY);
    return token;
  }
  return undefined;
}
