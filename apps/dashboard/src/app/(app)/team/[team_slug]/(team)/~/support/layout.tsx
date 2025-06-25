import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { SupportLayout } from "./SupportLayout";

export default async function Layout({
  params,
  children,
}: {
  params: { team_slug: string };
  children: React.ReactNode;
}) {
  const [account, team, authToken] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}/~/support`),
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/support`);
  }

  if (!team) {
    redirect("/team");
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <SupportLayout team={team} account={account} client={client}>
      {children}
    </SupportLayout>
  );
}
