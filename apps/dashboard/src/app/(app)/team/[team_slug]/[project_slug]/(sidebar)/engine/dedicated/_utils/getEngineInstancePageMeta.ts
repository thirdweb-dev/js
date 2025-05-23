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

  const [authToken, account] = await Promise.all([
    getAuthToken(),
    getValidAccount(pagePath),
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

  if (!instance) {
    // this case is already handled in layout
    notFound();
  }

  return { instance, authToken, account };
}
