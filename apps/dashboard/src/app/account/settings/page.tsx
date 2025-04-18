import { getDefaultTeam } from "@/api/team";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { loginRedirect } from "../../login/loginRedirect";
import { AccountSettingsPage } from "./AccountSettingsPage";
import { getValidAccount } from "./getAccount";

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

  const client = getThirdwebClient({
    jwt: token,
    teamId: undefined,
  });

  return (
    <AccountSettingsPage
      account={account}
      client={client}
      defaultTeamSlug={defaultTeam.slug}
      defaultTeamName={defaultTeam.name}
    />
  );
}
