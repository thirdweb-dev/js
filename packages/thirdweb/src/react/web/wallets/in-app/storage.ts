import type { AuthArgsType } from "../../../../wallets/in-app/core/authentication/type.js";
import { getStorage } from "../../../core/storage.js";

const LAST_AUTH_PROVIDER_STORAGE_KEY = "lastAuthProvider";

export async function setLastAuthProvider(
  authProvider: AuthArgsType["strategy"],
) {
  await getStorage().setItem(LAST_AUTH_PROVIDER_STORAGE_KEY, authProvider);
}

export async function getLastAuthProvider() {
  return (await getStorage().getItem(LAST_AUTH_PROVIDER_STORAGE_KEY)) as
    | AuthArgsType["strategy"]
    | null;
}
