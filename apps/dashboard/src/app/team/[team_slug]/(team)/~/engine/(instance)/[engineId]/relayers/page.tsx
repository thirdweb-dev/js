import { getValidAccount } from "../../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../../login/loginRedirect";
import type { EngineInstancePageProps } from "../types";
import { EngineRelayersPage } from "./relayers-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const pagePath = `/team/${params.team_slug}/~/engine/${params.engineId}/relayers`;
  const [account, authToken] = await Promise.all([
    getValidAccount(pagePath),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(pagePath);
  }

  return (
    <EngineRelayersPage
      engineId={params.engineId}
      team_slug={params.team_slug}
      twAccount={account}
      authToken={authToken}
    />
  );
}
