"use client";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";
import { apiServerProxy } from "@/actions/proxies";
import { sendTeamInvites } from "@/actions/sendTeamInvite";
import {
  reportOnboardingCompleted,
  reportOnboardingStarted,
} from "@/analytics/report";
import type { Team } from "@/api/team";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { updateTeam } from "../../../(app)/team/[team_slug]/(team)/~/settings/general/updateTeam";
import { InviteTeamMembersUI } from "./InviteTeamMembers";
import { TeamInfoFormUI } from "./TeamInfoForm";

export function TeamInfoForm(props: {
  client: ThirdwebClient;
  teamId: string;
  teamSlug: string;
}) {
  const router = useDashboardRouter();

  // eslint-disable-next-line no-restricted-syntax
  useEffectOnce(() => {
    reportOnboardingStarted();
  });

  return (
    <TeamInfoFormUI
      client={props.client}
      isTeamSlugAvailable={async (slug) => {
        const res = await apiServerProxy<{
          result: boolean;
        }>({
          method: "GET",
          pathname: "/v1/teams/check-slug",
          searchParams: {
            slug,
          },
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        return res.data.result;
      }}
      onComplete={(updatedTeam) => {
        router.replace(`/get-started/team/${updatedTeam.slug}/select-plan`);
      }}
      teamSlug={props.teamSlug}
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
      getTeam={async () => {
        const res = await apiServerProxy<{
          result: Team;
        }>({
          method: "GET",
          pathname: `/v1/teams/${props.team.slug}`,
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        return res.data.result;
      }}
      inviteTeamMembers={async (params) => {
        const res = await sendTeamInvites({
          invites: params,
          teamId: props.team.id,
        });

        if (!res.ok) {
          throw new Error(res.errorMessage);
        }

        return {
          results: res.results,
        };
      }}
      onComplete={() => {
        // at this point the team onboarding is complete
        reportOnboardingCompleted();
        router.replace(`/team/${props.team.slug}`);
      }}
      team={props.team}
    />
  );
}
