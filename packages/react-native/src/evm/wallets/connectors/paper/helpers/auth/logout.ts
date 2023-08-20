import {
  removeAuthShareInClient,
  removeLoggedInWalletUserId,
} from "../storage/local";

export async function logoutUser(clientId: string): Promise<boolean> {
  const isLoggedUserOutIncognito = removeAuthShareInClient(clientId);
  await removeLoggedInWalletUserId(clientId);
  return isLoggedUserOutIncognito;
}
