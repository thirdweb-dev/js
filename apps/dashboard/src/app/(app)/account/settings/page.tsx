import { getValidAccount } from "@/api/account/get-account";
import { getAuthToken } from "@/api/auth-token";
import { getDefaultTeam } from "@/api/team/get-team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { AccountSettingsPage } from "./AccountSettingsPage";

export default async function Page() {
  const pagePath = "/account";

  const [defaultTeam, account, token] = await Promise.all([
    getDefaultTeam(),
    getValidAccount(pagePath),
    getAuthToken(),
  ]);

  if (!token || !defaultTeam) {
    loginRedirect(pagePath);
  }

  const client = getClientThirdwebClient({
    jwt: token,
    teamId: undefined,
  });

  return (
    <AccountSettingsPage
      account={account}
      client={client}
      defaultTeamName={defaultTeam.name}
      defaultTeamSlug={defaultTeam.slug}
    />
  );
}
