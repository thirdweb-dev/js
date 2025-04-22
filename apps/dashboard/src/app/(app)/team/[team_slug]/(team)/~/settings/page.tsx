import { getTeamBySlug } from "@/api/team";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { notFound } from "next/navigation";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { TeamGeneralSettingsPage } from "./general/TeamGeneralSettingsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  const [team, account, token] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getValidAccount(`/team/${params.team_slug}/settings`),
    getAuthToken(),
  ]);

  if (!team || !token) {
    notFound();
  }

  const client = getThirdwebClient({
    jwt: token,
    teamId: team.id,
  });

  return (
    <TeamGeneralSettingsPage
      team={team}
      client={client}
      accountId={account.id}
    />
  );
}
