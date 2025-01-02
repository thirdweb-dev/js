import { getValidAccount } from "../../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../../login/loginRedirect";
import type { EngineInstancePageProps } from "../types";
import EngineAlertsPageWithLayout from "./alerts-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  const pagePath = `/team/${params.team_slug}/~/engine/${params.engineId}/alerts`;

  const [authToken, account] = await Promise.all([
    getAuthToken(),
    getValidAccount(pagePath),
  ]);

  if (!authToken) {
    loginRedirect(pagePath);
  }

  return (
    <EngineAlertsPageWithLayout
      engineId={params.engineId}
      team_slug={params.team_slug}
      twAccount={account}
      authToken={authToken}
    />
  );
}
