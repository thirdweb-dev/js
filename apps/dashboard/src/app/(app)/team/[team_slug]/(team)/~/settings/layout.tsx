import { redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../../../../../@/api/auth-token";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { SettingsLayout } from "./SettingsLayout";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const [account, team, authToken] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}/~/settings`),
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/settings`);
  }

  if (!team) {
    redirect("/team");
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <SettingsLayout account={account} client={client} team={team}>
      {props.children}
    </SettingsLayout>
  );
}
