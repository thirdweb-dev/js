import { getTeamBySlug } from "@/api/team";
import { getMembers } from "@/api/team-members";
import { notFound } from "next/navigation";
import { getAccount } from "../../../../../../account/settings/getAccount";
import { TeamMembersSettingsPage } from "./TeamMembersSettingsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const [account, team, members] = await Promise.all([
    getAccount(),
    getTeamBySlug((await props.params).team_slug),
    getMembers((await props.params).team_slug),
  ]);

  if (!team || !account || !members) {
    notFound();
  }

  const accountMemberInfo = members.find((m) => m.accountId === account.id);

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
