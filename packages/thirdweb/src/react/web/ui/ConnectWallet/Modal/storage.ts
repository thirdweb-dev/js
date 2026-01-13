import type { AuthArgsType } from "../../../../../wallets/in-app/core/authentication/types.js";
import { LAST_USED_WALLET_ID } from "../../../../../wallets/manager/index.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import { LAST_AUTH_PROVIDER_STORAGE_KEY } from "../../../../core/utils/storage.js";

export function getLastUsedWalletId() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(
        LAST_USED_WALLET_ID,
      ) as WalletId | null;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getLastUsedSocialAuth() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(LAST_AUTH_PROVIDER_STORAGE_KEY) as
        | (AuthArgsType["strategy"] & string)
        | null;
    }
  } catch {
    // ignore
  }
  return null;
}
