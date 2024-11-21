import { getTeamBySlug } from "@/api/team";
import { getMembers } from "@/api/team-members";
import { notFound, redirect } from "next/navigation";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { TeamMembersSettingsPage } from "./TeamMembersSettingsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  const [account, team, members] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}/~/settings/members`),
    getTeamBySlug(params.team_slug),
    getMembers(params.team_slug),
  ]);

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

  return (
    <TeamMembersSettingsPage
      team={team}
      members={members}
      userHasEditPermission={accountMemberInfo.role === "OWNER"}
    />
  );
}
