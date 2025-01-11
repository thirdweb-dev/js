import { getValidAccount } from "../../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../../login/loginRedirect";
import type { EngineInstancePageProps } from "../types";
import { EngineExplorerPage } from "./explorer-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  const pagePath = `/team/${params.team_slug}/~/engine/${params.engineId}/explorer`;

  const [authToken, account] = await Promise.all([
    getAuthToken(),
    getValidAccount(pagePath),
  ]);

  if (!authToken) {
    loginRedirect(pagePath);
  }

  return (
    <EngineExplorerPage
      engineId={params.engineId}
      team_slug={params.team_slug}
      twAccount={account}
      authToken={authToken}
    />
  );
}
