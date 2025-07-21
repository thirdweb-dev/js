import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { getValidAccount } from "../../../../../../../account/settings/getAccount";
import { getEngineInstance } from "./getEngineInstance";

export async function engineInstancePageHandler(params: {
  teamSlug: string;
  projectSlug: string;
  engineId: string;
}) {
  const pagePath = `/team/${params.teamSlug}/${params.projectSlug}/engine/dedicated/${params.engineId}/access-tokens`;

  const [authToken, account, team] = await Promise.all([
    getAuthToken(),
    getValidAccount(pagePath),
    getTeamBySlug(params.teamSlug),
  ]);

  if (!authToken) {
    loginRedirect(pagePath);
  }

  const instance = await getEngineInstance({
    accountId: account.id,
    authToken,
    engineId: params.engineId,
    teamIdOrSlug: params.teamSlug,
  });

  if (!instance || !team) {
    // this case is already handled in layout
    notFound();
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return { account, authToken, client, instance };
}
