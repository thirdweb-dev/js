import {
  removeAuthTokenInClient,
  removeLoggedInWalletUserId,
} from "../storage/local";
import { getCognitoUser } from "../storage/state";

export async function logoutUser(clientId: string): Promise<boolean> {
  const isLoggedUserOutIncognito = await removeAuthTokenInClient(clientId);
  await removeLoggedInWalletUserId(clientId);
  const cognitoUser = getCognitoUser();
  cognitoUser?.signOut();
  return isLoggedUserOutIncognito;
}
