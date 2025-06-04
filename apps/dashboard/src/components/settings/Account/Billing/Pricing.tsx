"use client";

import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useTransition } from "react";

import { useStripeRedirectEvent } from "../../../../app/(app)/(stripe)/stripe-redirect/stripeRedirectChannel";
import { getValidTeamPlan } from "../../../../app/(app)/team/components/TeamHeader/getValidTeamPlan";
import { PRO_CONTACT_US_URL } from "../../../../constants/pro";

// this is used to determine whether to show "Upgrade" or "Downgrade" label based on tier level
const planToTierRecord: Record<Team["billingPlan"], number> = {
  free: 0,
  starter: 2,
  growth_legacy: 3,
  growth: 4,
  accelerate: 5,
  scale: 6,
  pro: 7,
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
          current={validTeamPlan === "starter"}
          cta={getPlanCta(
            validTeamPlan,
            "starter",
            isCurrentPlanScheduledToCancel,
          )}
          teamSlug={team.slug}
          teamId={team.id}
          highlighted={highlightStarterPlan}
          getTeam={getTeam}
        />

        {/* Growth */}
        <PricingCard
          billingPlan="growth"
          billingStatus={team.billingStatus}
          activeTrialEndsAt={
            validTeamPlan === "growth" ? trialPeriodEndedAt : undefined
          }
          current={validTeamPlan === "growth"}
          cta={getPlanCta(
            validTeamPlan,
            "growth",
            isCurrentPlanScheduledToCancel,
          )}
          highlighted={highlightGrowthPlan}
          teamSlug={team.slug}
          teamId={team.id}
          getTeam={getTeam}
        />

        {/* Scale */}
        <PricingCard
          billingPlan="scale"
          billingStatus={team.billingStatus}
          teamSlug={team.slug}
          teamId={team.id}
          current={validTeamPlan === "scale"}
          cta={getPlanCta(
            validTeamPlan,
            "scale",
            isCurrentPlanScheduledToCancel,
          )}
          highlighted={highlightScalePlan}
          getTeam={getTeam}
        />

        {/* Pro */}
        <PricingCard
          billingPlan="pro"
          billingStatus={team.billingStatus}
          teamSlug={team.slug}
          teamId={team.id}
          current={validTeamPlan === "pro"}
          cta={getPlanCta(validTeamPlan, "pro", isCurrentPlanScheduledToCancel)}
          highlighted={highlightProPlan}
          getTeam={getTeam}
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
      label: "Contact us",
      href: PRO_CONTACT_US_URL,
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
