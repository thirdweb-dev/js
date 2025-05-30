import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { notFound } from "next/navigation";
import { getValidAccount } from "../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../login/loginRedirect";
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
    teamIdOrSlug: params.teamSlug,
    authToken,
    engineId: params.engineId,
    accountId: account.id,
  });

  if (!instance || !team) {
    // this case is already handled in layout
    notFound();
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return { instance, authToken, account, client };
}
