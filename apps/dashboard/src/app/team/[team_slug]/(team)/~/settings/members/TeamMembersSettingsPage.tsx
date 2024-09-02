import type { Team } from "@/api/team";
import type { TeamMember } from "@/api/team-members";
import { InviteSection } from "./InviteSection";
import { ManageMembersSection } from "./ManageMembersSection";

export function TeamMembersSettingsPage(props: {
  team: Team;
  userHasEditPermission: boolean;
  members: TeamMember[];
}) {
  return (
    <div>
      <InviteSection
        team={props.team}
        userHasEditPermission={props.userHasEditPermission}
      />
      <div className="h-10" />
      <ManageMembersSection
        team={props.team}
        userHasEditPermission={props.userHasEditPermission}
        members={props.members}
      />
    </div>
  );
}
