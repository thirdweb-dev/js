import type { LogoutReturnType } from "../../../core/authentication/type.js";
import {
  removeAuthTokenInClient,
  removeLoggedInWalletUserId,
} from "../storage/local.js";
import { getCognitoUser } from "../storage/state.js";

export async function logoutUser(clientId: string): Promise<LogoutReturnType> {
  const isLoggedUserOutIncognito = await removeAuthTokenInClient(clientId);
  await removeLoggedInWalletUserId(clientId);
  const cognitoUser = getCognitoUser();
  cognitoUser?.signOut();
  return { success: isLoggedUserOutIncognito };
}
