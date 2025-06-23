import { notFound, redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
import { getTeamInvites } from "@/api/team-invites";
import { getMembers } from "@/api/team-members";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../../../../../../../@/api/auth-token";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { getRecommendedMembers } from "./getRecommendedMembers";
import { TeamMembersSettingsPage } from "./TeamMembersSettingsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const pagePath = `/team/${params.team_slug}/~/settings/members`;

  const [authToken, account, team, members, teamInvites] = await Promise.all([
    getAuthToken(),
    getValidAccount(pagePath),
    getTeamBySlug(params.team_slug),
    getMembers(params.team_slug),
    getTeamInvites(params.team_slug, {
      count: 100,
      start: 0,
    }),
  ]);

  if (!authToken) {
    redirect(pagePath);
  }

  if (!team) {
    redirect("/team");
  }

  // unexpected error
  if (!members) {
    notFound();
  }

  const accountMemberInfo = members.find((m) => m.accountId === account.id);

  // unexpected error
  if (!accountMemberInfo) {
    notFound();
  }

  const pendingOrExpiredInvites = teamInvites.filter(
    (invite) => invite.status === "pending" || invite.status === "expired",
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  const recommendedMembers = team.verifiedDomain
    ? await getRecommendedMembers({
        authToken,
        teamId: team.id,
      })
    : [];

  return (
    <TeamMembersSettingsPage
      client={client}
      members={members}
      recommendedMembers={recommendedMembers}
      team={team}
      teamInvites={pendingOrExpiredInvites}
      userHasEditPermission={accountMemberInfo.role === "OWNER"}
    />
  );
}
