import type { LogoutReturnType } from "../../../core/authentication/types.js";
import {
  removeAuthTokenInClient,
  removeLoggedInWalletUserId,
} from "../storage/local.js";

export async function logoutUser(clientId: string): Promise<LogoutReturnType> {
  const isLoggedUserOutIncognito = await removeAuthTokenInClient(clientId);
  await removeLoggedInWalletUserId(clientId);

  return { success: isLoggedUserOutIncognito };
}
