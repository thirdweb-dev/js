"use client";

import { redirectToCheckout } from "@/actions/billing";
import { apiServerProxy } from "@/actions/proxies";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { revalidateTeamLayout } from "./actions";
import { TeamOnboardingUI } from "./team-onboarding-ui";

export function TeamOnboarding(props: {
  teamSlug: string;
  teamId: string;
}) {
  const router = useDashboardRouter();
  return (
    <TeamOnboardingUI
      redirectToCheckout={redirectToCheckout}
      redirectPath={`/team/${props.teamSlug}`}
      sendTeamOnboardingData={async (params) => {
        const teamOnboardRes = await apiServerProxy({
          pathname: `/v1/teams/${props.teamId}/onboard`,
          method: "PUT",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!teamOnboardRes.ok) {
          throw new Error(teamOnboardRes.error);
        }
      }}
      onSkipPlan={async () => {
        // This is required - because the /team layout is cached because user already landed on this page and got redirected to /get-started
        // so when calling onSkipPlan - user will land on cached /team layout - and that will create a redirect loop
        await revalidateTeamLayout(props.teamSlug);
        router.replace(`/team/${props.teamSlug}`);
      }}
      teamSlug={props.teamId}
    />
  );
}
