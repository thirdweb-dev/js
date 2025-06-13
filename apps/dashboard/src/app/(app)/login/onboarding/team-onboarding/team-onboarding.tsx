"use client";
import { apiServerProxy } from "@/actions/proxies";
import { sendTeamInvites } from "@/actions/sendTeamInvite";
import type { Team } from "@/api/team";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { updateTeam } from "../../../team/[team_slug]/(team)/~/settings/general/updateTeam";
import { InviteTeamMembersUI } from "./InviteTeamMembers";
import { TeamInfoFormUI } from "./TeamInfoForm";

export function TeamInfoForm(props: {
  client: ThirdwebClient;
  teamId: string;
  teamSlug: string;
}) {
  const router = useDashboardRouter();

  return (
    <TeamInfoFormUI
      isTeamSlugAvailable={async (slug) => {
        const res = await apiServerProxy<{
          result: boolean;
        }>({
          pathname: "/v1/teams/check-slug",
          searchParams: {
            slug,
          },
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        return res.data.result;
      }}
      teamSlug={props.teamSlug}
      client={props.client}
      onComplete={(updatedTeam) => {
        router.replace(`/get-started/team/${updatedTeam.slug}/select-plan`);
      }}
      updateTeam={async (data) => {
        const teamValue: Partial<Team> = {
          name: data.name,
          slug: data.slug,
        };

        if (data.image) {
          try {
            teamValue.image = await upload({
              client: props.client,
              files: [data.image],
            });
          } catch {
            // If image upload fails - ignore image, continue with the rest of the update
            toast.error("Failed to upload image");
          }
        }

        const res = await updateTeam({
          teamId: props.teamId,
          value: teamValue,
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        return res.data;
      }}
    />
  );
}

export function InviteTeamMembers(props: {
  team: Team;
  client: ThirdwebClient;
}) {
  const router = useDashboardRouter();

  return (
    <InviteTeamMembersUI
      client={props.client}
      onComplete={() => {
        router.replace(`/team/${props.team.slug}`);
      }}
      getTeam={async () => {
        const res = await apiServerProxy<{
          result: Team;
        }>({
          pathname: `/v1/teams/${props.team.slug}`,
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        return res.data.result;
      }}
      team={props.team}
      inviteTeamMembers={async (params) => {
        const res = await sendTeamInvites({
          teamId: props.team.id,
          invites: params,
        });

        if (!res.ok) {
          throw new Error(res.errorMessage);
        }

        return {
          results: res.results,
        };
      }}
    />
  );
}
