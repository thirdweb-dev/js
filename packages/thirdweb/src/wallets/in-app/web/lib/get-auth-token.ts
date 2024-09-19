import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { ClientScopedStorage } from "../../core/authentication/client-scoped-storage.js";
import type { Ecosystem } from "../types.js";

export async function getAuthToken(
  client: ThirdwebClient,
  ecosystem?: Ecosystem,
) {
  const localStorage = new ClientScopedStorage({
    storage: webLocalStorage,
    clientId: client.clientId,
    ecosystemId: ecosystem?.id,
  });

  return localStorage.getAuthCookie();
}
