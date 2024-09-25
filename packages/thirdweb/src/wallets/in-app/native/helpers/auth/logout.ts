import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { LogoutReturnType } from "../../../core/authentication/types.js";
import { removeLoggedInWalletUserId } from "../storage/local.js";

export async function logoutUser(args: {
  client: ThirdwebClient;
  storage: ClientScopedStorage;
}): Promise<LogoutReturnType> {
  const isLoggedUserOutIncognito = await args.storage.removeAuthCookie();
  await removeLoggedInWalletUserId(args.client.clientId); // TODO (enclave): move this to client scoped storage
  return { success: isLoggedUserOutIncognito };
}
