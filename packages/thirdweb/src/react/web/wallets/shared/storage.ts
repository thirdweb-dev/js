import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import type { AuthArgsType } from "../../../../wallets/in-app/core/authentication/type.js";

const LAST_AUTH_PROVIDER_STORAGE_KEY = "lastAuthProvider";

export async function setLastAuthProvider(
  authProvider: AuthArgsType["strategy"],
  storage: AsyncStorage,
) {
  await storage.setItem(LAST_AUTH_PROVIDER_STORAGE_KEY, authProvider);
}

export async function getLastAuthProvider(storage: AsyncStorage) {
  return (await storage.getItem(LAST_AUTH_PROVIDER_STORAGE_KEY)) as
    | AuthArgsType["strategy"]
    | null;
}
