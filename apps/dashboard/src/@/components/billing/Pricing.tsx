"use client";

import { useTransition } from "react";
import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { PRO_CONTACT_US_URL } from "@/constants/pro";
import { useStripeRedirectEvent } from "@/hooks/stripe/redirect-event";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";

// this is used to determine whether to show "Upgrade" or "Downgrade" label based on tier level
const planToTierRecord: Record<Team["billingPlan"], number> = {
  accelerate: 5,
  free: 0,
  growth: 4,
  growth_legacy: 3,
  pro: 7,
  scale: 6,
  starter: 2,
};

interface BillingPricingProps {
  team: Team;
  trialPeriodEndedAt: string | undefined;
  getTeam: () => Promise<Team>;
  highlightPlan: Team["billingPlan"] | undefined;
}

type CtaLink =
  | {
      type: "renew";
    }
  | {
      type: "checkout";
      label: string;
    }
  | {
      label: string;
      href: string;
      type: "link";
    };

export const BillingPricing: React.FC<BillingPricingProps> = ({
  team,
  trialPeriodEndedAt,
  getTeam,
  highlightPlan,
}) => {
  const validTeamPlan = getValidTeamPlan(team);
  const [isPending, startTransition] = useTransition();
  const router = useDashboardRouter();

  useStripeRedirectEvent(() => {
    setTimeout(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 1000);
  });

  const isCurrentPlanScheduledToCancel = team.planCancellationDate !== null;

  const highlightGrowthPlan =
    highlightPlan === "growth" ||
    (!highlightPlan &&
      !isCurrentPlanScheduledToCancel &&
      (validTeamPlan === "free" ||
        validTeamPlan === "starter" ||
        validTeamPlan === "growth_legacy"));

  const highlightStarterPlan = highlightPlan === "starter";
  const highlightScalePlan =
    highlightPlan === "scale" ||
    (!highlightPlan &&
      !isCurrentPlanScheduledToCancel &&
      (validTeamPlan === "accelerate" || validTeamPlan === "growth"));
  const highlightProPlan =
    highlightPlan === "pro" ||
    (!highlightPlan &&
      !isCurrentPlanScheduledToCancel &&
      validTeamPlan === "pro");

  return (
    <div>
      <h2 className="mb-0.5 inline-flex items-center gap-3 font-semibold text-2xl tracking-tighter">
        {validTeamPlan === "free" ? "Select a plan" : "Change Plan"}{" "}
        {isPending && <Spinner className="size-5" />}
      </h2>

      <p className="text-muted-foreground text-sm">
        Upgrade or downgrade your plan here to better fit your needs.
      </p>

      <div className="h-5" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Starter */}
        <PricingCard
          billingPlan="starter"
          billingStatus={team.billingStatus}
          cta={getPlanCta(
            validTeamPlan,
            "starter",
            isCurrentPlanScheduledToCancel,
          )}
          current={validTeamPlan === "starter"}
          getTeam={getTeam}
          highlighted={highlightStarterPlan}
          teamId={team.id}
          teamSlug={team.slug}
        />

        {/* Growth */}
        <PricingCard
          activeTrialEndsAt={
            validTeamPlan === "growth" ? trialPeriodEndedAt : undefined
          }
          billingPlan="growth"
          billingStatus={team.billingStatus}
          cta={getPlanCta(
            validTeamPlan,
            "growth",
            isCurrentPlanScheduledToCancel,
          )}
          current={validTeamPlan === "growth"}
          getTeam={getTeam}
          highlighted={highlightGrowthPlan}
          teamId={team.id}
          teamSlug={team.slug}
        />

        {/* Scale */}
        <PricingCard
          billingPlan="scale"
          billingStatus={team.billingStatus}
          cta={getPlanCta(
            validTeamPlan,
            "scale",
            isCurrentPlanScheduledToCancel,
          )}
          current={validTeamPlan === "scale"}
          getTeam={getTeam}
          highlighted={highlightScalePlan}
          teamId={team.id}
          teamSlug={team.slug}
        />

        {/* Pro */}
        <PricingCard
          billingPlan="pro"
          billingStatus={team.billingStatus}
          cta={getPlanCta(validTeamPlan, "pro", isCurrentPlanScheduledToCancel)}
          current={validTeamPlan === "pro"}
          getTeam={getTeam}
          highlighted={highlightProPlan}
          teamId={team.id}
          teamSlug={team.slug}
        />
      </div>
    </div>
  );
};

function getPlanCta(
  currentPlan: Team["billingPlan"],
  targetPlan: Team["billingPlan"],
  isScheduledToCancel: boolean,
): CtaLink | undefined {
  // if the CURRENT plan is pro, show contact us link
  if (currentPlan === "pro") {
    return {
      href: PRO_CONTACT_US_URL,
      label: "Contact us",
      type: "link",
    };
  }

  // if both same plan - return undefined...
  if (currentPlan === targetPlan) {
    // ...UNLESS the plan is scheduled to cancel - show the renew button
    if (isScheduledToCancel) {
      return {
        type: "renew",
      };
    }
    return undefined;
  }

  const label =
    planToTierRecord[currentPlan] < planToTierRecord[targetPlan]
      ? "Upgrade"
      : "Downgrade";

  return {
    label,
    type: "checkout",
  };
}
