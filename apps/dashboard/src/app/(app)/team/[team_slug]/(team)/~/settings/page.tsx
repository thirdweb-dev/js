import { notFound } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
import { getMemberByAccountId } from "@/api/team-members";
import { checkDomainVerification } from "@/api/verified-domain";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../../../../../@/api/auth-token";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { TeamGeneralSettingsPage } from "./general/TeamGeneralSettingsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  // have to get the account FIRST to get to the team member below :-/
  const account = await getValidAccount(`/team/${params.team_slug}/settings`);

  const [team, teamMember, token, initialVerification] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getMemberByAccountId(params.team_slug, account.id),
    getAuthToken(),
    checkDomainVerification(params.team_slug),
  ]);

  if (!team || !token) {
    notFound();
  }

  const client = getClientThirdwebClient({
    jwt: token,
    teamId: team.id,
  });

  const isOwnerAccount = teamMember?.role === "OWNER";

  return (
    <TeamGeneralSettingsPage
      accountId={account.id}
      client={client}
      initialVerification={initialVerification}
      isOwnerAccount={isOwnerAccount}
      team={team}
    />
  );
}
