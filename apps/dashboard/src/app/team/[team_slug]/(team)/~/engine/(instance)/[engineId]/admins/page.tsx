import { getValidAccount } from "../../../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../../login/loginRedirect";
import type { EngineInstancePageProps } from "../types";
import { EngineAdminsPage } from "./admins-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;

  const pagePath = `/team/${params.team_slug}/~/engine/${params.engineId}/admins`;

  const [authToken, twAccount] = await Promise.all([
    getAuthToken(),
    getValidAccount(pagePath),
  ]);

  if (!authToken) {
    loginRedirect(pagePath);
  }

  return (
    <EngineAdminsPage
      engineId={params.engineId}
      team_slug={params.team_slug}
      twAccount={twAccount}
      authToken={authToken}
    />
  );
}
