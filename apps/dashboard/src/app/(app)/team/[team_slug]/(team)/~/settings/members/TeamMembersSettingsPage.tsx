"use client";

import { apiServerProxy } from "@/actions/proxies";
import { sendTeamInvites } from "@/actions/sendTeamInvite";
import type { Team } from "@/api/team";
import type { TeamInvite } from "@/api/team-invites";
import type { TeamMember } from "@/api/team-members";
import { TabButtons } from "@/components/ui/tabs";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
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
      <p className="text-muted-foreground text-sm">
        Manage team members and invitations
      </p>

      <div className="h-5" />

      <InviteSection
        team={props.team}
        client={props.client}
        userHasEditPermission={props.userHasEditPermission}
        inviteTeamMembers={async (params) => {
          const res = await sendTeamInvites({
            teamId: props.team.id,
            invites: params,
          });

          if (!res.ok) {
            throw new Error(res.errorMessage);
          }

          router.refresh();

          return {
            results: res.results,
          };
        }}
        // TODO
        recommendedMembers={props.recommendedMembers}
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
          team={props.team}
          userHasEditPermission={props.userHasEditPermission}
          members={props.members}
          client={props.client}
          deleteMember={async (memberAccountId) => {
            const res = await apiServerProxy({
              pathname: `/v1/teams/${props.team.id}/members/${memberAccountId}`,
              method: "DELETE",
            });

            router.refresh();

            if (!res.ok) {
              throw new Error(res.error);
            }
          }}
        />
      )}

      {manageTab === "invites" && (
        <ManageInvitesSection
          team={props.team}
          userHasEditPermission={props.userHasEditPermission}
          client={props.client}
          deleteInvite={async (inviteId) => {
            const res = await apiServerProxy({
              pathname: `/v1/teams/${props.team.id}/invites/${inviteId}`,
              method: "DELETE",
            });

            router.refresh();

            if (!res.ok) {
              throw new Error(res.error);
            }
          }}
          teamInvites={props.teamInvites}
        />
      )}
    </div>
  );
}
