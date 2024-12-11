import { getValidAccount } from "../../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../../login/loginRedirect";
import type { EngineInstancePageProps } from "../types";
import { EngineWebhooksPage } from "./webhooks-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  const pagePath = `/team/${params.team_slug}/~/engine/${params.engineId}/webhooks`;

  const [account, authToken] = await Promise.all([
    getValidAccount(pagePath),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(pagePath);
  }

  return (
    <EngineWebhooksPage
      team_slug={params.team_slug}
      engineId={params.engineId}
      twAccount={account}
      authToken={authToken}
    />
  );
}
