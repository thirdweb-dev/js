import { webLocalStorage } from "../../../utils/storage/webStorage.js";
import { getLastAuthProvider as getLastAuthProviderCore } from "../../core/utils/storage.js";

/**
 * Retrieves the last authentication provider used from local storage.
 *
 * This function is designed to work only in a browser environment.
 *
 * @returns {Promise<AuthArgsType["strategy"] | null>} A promise that resolves to the last
 * authentication provider strategy used, or `null` if none is found.
 *
 * @example
 * ```typescript
 * import { getLastAuthProvider } from "thirdweb/react";
 *
 * const lastAuthProvider = await getLastAuthProvider();
 * ```
 *
 * @utils
 */
export async function getLastAuthProvider() {
  return getLastAuthProviderCore(webLocalStorage);
}
