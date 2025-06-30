"use client";

import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { apiServerProxy } from "@/actions/proxies";
import { sendTeamInvites } from "@/actions/sendTeamInvite";
import type { Team } from "@/api/team";
import type { TeamInvite } from "@/api/team-invites";
import type { TeamMember } from "@/api/team-members";
import { TabButtons } from "@/components/ui/tabs";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { InviteSection, type RecommendedMember } from "./InviteSection";
import { ManageInvitesSection } from "./ManageInvitesSection";
import { ManageMembersSection } from "./ManageMembersSection";

export function TeamMembersSettingsPage(props: {
  team: Team;
  userHasEditPermission: boolean;
  members: TeamMember[];
  client: ThirdwebClient;
  teamInvites: TeamInvite[];
  recommendedMembers: RecommendedMember[];
}) {
  const [manageTab, setManageTab] = useState<"members" | "invites">("members");
  const router = useDashboardRouter();

  return (
    <div>
      <h2 className="font-semibold text-2xl tracking-tight">Members</h2>
      <p className="text-muted-foreground">
        Manage team members and invitations
      </p>

      <div className="h-5" />

      <InviteSection
        client={props.client}
        inviteTeamMembers={async (params) => {
          const res = await sendTeamInvites({
            invites: params,
            teamId: props.team.id,
          });

          if (!res.ok) {
            throw new Error(res.errorMessage);
          }

          router.refresh();

          return {
            results: res.results,
          };
        }}
        recommendedMembers={props.recommendedMembers}
        team={props.team}
        // TODO
        userHasEditPermission={props.userHasEditPermission}
      />

      <div className="h-10" />

      <TabButtons
        tabClassName="!text-sm"
        tabs={[
          {
            isActive: manageTab === "members",
            name: "Team Members",
            onClick: () => setManageTab("members"),
          },
          {
            isActive: manageTab === "invites",
            name: "Pending Invites",
            onClick: () => setManageTab("invites"),
          },
        ]}
      />

      <div className="h-3" />

      {manageTab === "members" && (
        <ManageMembersSection
          client={props.client}
          deleteMember={async (memberAccountId) => {
            const res = await apiServerProxy({
              method: "DELETE",
              pathname: `/v1/teams/${props.team.id}/members/${memberAccountId}`,
            });

            router.refresh();

            if (!res.ok) {
              throw new Error(res.error);
            }
          }}
          members={props.members}
          team={props.team}
          userHasEditPermission={props.userHasEditPermission}
        />
      )}

      {manageTab === "invites" && (
        <ManageInvitesSection
          client={props.client}
          deleteInvite={async (inviteId) => {
            const res = await apiServerProxy({
              method: "DELETE",
              pathname: `/v1/teams/${props.team.id}/invites/${inviteId}`,
            });

            router.refresh();

            if (!res.ok) {
              throw new Error(res.error);
            }
          }}
          team={props.team}
          teamInvites={props.teamInvites}
          userHasEditPermission={props.userHasEditPermission}
        />
      )}
    </div>
  );
}
