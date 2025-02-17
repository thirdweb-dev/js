"use client";

import type { RedirectBillingCheckoutAction } from "@/actions/billing";
import { apiServerProxy } from "@/actions/proxies";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { OnboardingChoosePlan } from "./ChoosePlan";
import {
  ConnectEmbedSizedCard,
  ConnectEmbedSizedLoadingCard,
  OnboardingCard,
} from "./onboarding-container";
import { useSkipOnboarding } from "./useSkipOnboarding";

function ShowPlansOnboarding(props: {
  accountId: string;
  onComplete: () => void;
  redirectPath: string;
  redirectToCheckout: RedirectBillingCheckoutAction;
}) {
  const skipOnboarding = useSkipOnboarding();
  const teamsQuery = useTeams(props.accountId);

  if (teamsQuery.isPending) {
    return <ConnectEmbedSizedLoadingCard />;
  }

  const team = teamsQuery.data?.[0];

  // should never happen - but just in case
  if (!team) {
    return (
      <ConnectEmbedSizedCard>
        <div className="flex flex-col items-center justify-center gap-4">
          <p> Something went wrong </p>
          <Button
            onClick={() => {
              // full reload
              window.location.reload();
            }}
          >
            Retry
          </Button>
        </div>
      </ConnectEmbedSizedCard>
    );
  }

  return (
    <OnboardingCard large>
      <OnboardingChoosePlan
        redirectPath={props.redirectPath}
        teamSlug={team.slug}
        skipPlan={async () => {
          await skipOnboarding().catch(() => {});
          props.onComplete();
        }}
        redirectToCheckout={props.redirectToCheckout}
      />
    </OnboardingCard>
  );
}

function useTeams(accountId: string) {
  return useQuery({
    queryKey: ["team", accountId],
    queryFn: async () => {
      const res = await apiServerProxy<{
        result: Team[];
      }>({
        pathname: "/v1/teams",
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(res.error);
      }

      return res.data.result;
    },
  });
}

export default ShowPlansOnboarding;
