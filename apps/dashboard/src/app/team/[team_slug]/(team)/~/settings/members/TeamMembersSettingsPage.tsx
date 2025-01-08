import type { Team } from "@/api/team";
import type { TeamMember } from "@/api/team-members";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { InviteSection } from "./InviteSection";
import { ManageMembersSection } from "./ManageMembersSection";

export function TeamMembersSettingsPage(props: {
  team: Team;
  userHasEditPermission: boolean;
  members: TeamMember[];
}) {
  return (
    <div>
      <Alert variant="info">
        <AlertCircleIcon className="size-5 text-red-400" />
        <AlertTitle>
          Inviting and Managing Team Members is not available yet
        </AlertTitle>
        <AlertDescription>
          This feature will be available in Q1 2025
        </AlertDescription>
      </Alert>
      <div className="h-10" />

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
