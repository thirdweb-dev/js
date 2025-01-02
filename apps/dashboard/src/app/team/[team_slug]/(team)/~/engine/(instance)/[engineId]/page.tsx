import { getValidAccount } from "../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../login/loginRedirect";
import { EngineOverviewPage } from "./overview/overview-page.client";
import type { EngineInstancePageProps } from "./types";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const pagePath = `/team/${params.team_slug}/~/engine/${params.engineId}`;
  const [authToken, account] = await Promise.all([
    getAuthToken(),
    getValidAccount(pagePath),
  ]);

  if (!authToken) {
    loginRedirect(pagePath);
  }

  return (
    <EngineOverviewPage
      engineId={params.engineId}
      teamSlug={params.team_slug}
      account={account}
      authToken={authToken}
    />
  );
}
