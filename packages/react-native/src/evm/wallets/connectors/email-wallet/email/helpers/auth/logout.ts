import {
  removeAuthTokenInClient,
  removeLoggedInWalletUserId,
} from "../storage/local";

export async function logoutUser(clientId: string): Promise<boolean> {
  const isLoggedUserOutIncognito = await removeAuthTokenInClient(clientId);
  await removeLoggedInWalletUserId(clientId);
  return isLoggedUserOutIncognito;
}
