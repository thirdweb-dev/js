import { getTeamBySlug } from "@/api/team";
import { getMembers } from "@/api/team-members";
import { notFound } from "next/navigation";
import { TeamMembersSettingsPage } from "./TeamMembersSettingsPage";

export default async function Page(props: {
  params: {
    team_slug: string;
  };
}) {
  const [team, members] = await Promise.all([
    getTeamBySlug(props.params.team_slug),
    getMembers(props.params.team_slug),
  ]);

  if (!team) {
    notFound();
  }

  return (
    <TeamMembersSettingsPage
      team={team}
      members={members}
      // TODO
      userHasEditPermission={true}
    />
  );
}
