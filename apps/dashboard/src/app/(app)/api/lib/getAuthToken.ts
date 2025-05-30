import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { LAST_USED_TEAM_ID } from "constants/cookies";
import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookiesManager = await cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const token = activeAccount
    ? cookiesManager.get(COOKIE_PREFIX_TOKEN + activeAccount)?.value
    : null;

  return token;
}

export async function getAuthTokenWalletAddress() {
  const cookiesManager = await cookies();
  const activeAccount = cookiesManager.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  if (!activeAccount) {
    return null;
  }

  const token = cookiesManager.get(COOKIE_PREFIX_TOKEN + activeAccount)?.value;

  if (token) {
    return activeAccount;
  }

  return null;
}

export async function getUserThirdwebClient(params: {
  teamId: string | undefined;
}) {
  const authToken = await getAuthToken();

  if (params.teamId) {
    return getClientThirdwebClient({
      jwt: authToken,
      teamId: params.teamId,
    });
  }

  const cookiesManager = await cookies();
  const lastUsedTeamId = cookiesManager.get(LAST_USED_TEAM_ID)?.value;

  return getClientThirdwebClient({
    jwt: authToken,
    teamId: lastUsedTeamId,
  });
}
