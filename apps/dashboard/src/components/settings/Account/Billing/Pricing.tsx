"use client";

import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import { useStripeRedirectEvent } from "../../../../app/(app)/(stripe)/stripe-redirect/stripeRedirectChannel";
import { getValidTeamPlan } from "../../../../app/(app)/team/components/TeamHeader/getValidTeamPlan";
import { PRO_CONTACT_US_URL } from "../../../../constants/pro";

// this is used to determine whether to show "Upgrade" or "Downgrade" label based on tier level
const planToTierRecord: Record<Team["billingPlan"], number> = {
  free: 0,
  starter_legacy: 1,
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
    !isCurrentPlanScheduledToCancel &&
    (validTeamPlan === "free" ||
      validTeamPlan === "starter" ||
      validTeamPlan === "growth_legacy");

  const highlightStarterPlan =
    !isCurrentPlanScheduledToCancel && validTeamPlan === "starter_legacy";
  const highlightAcceleratePlan =
    !isCurrentPlanScheduledToCancel && validTeamPlan === "growth";
  const highlightScalePlan =
    !isCurrentPlanScheduledToCancel && validTeamPlan === "accelerate";

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

        {/* Accelerate */}
        <PricingCard
          billingPlan="accelerate"
          billingStatus={team.billingStatus}
          teamSlug={team.slug}
          teamId={team.id}
          current={validTeamPlan === "accelerate"}
          cta={getPlanCta(
            validTeamPlan,
            "accelerate",
            isCurrentPlanScheduledToCancel,
          )}
          highlighted={highlightAcceleratePlan}
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
      </div>
      <div className="h-8" />
      <ProCard />
    </div>
  );
};

const proFeatures = [
  "Custom rate limits for APIs & Infra",
  "Guaranteed support response time",
  "Direct access to solutions & engineering teams",
  "Enterprise grade SLAs",
];

function ProCard() {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-lg border bg-card p-6 lg:flex-row">
      <div>
        <h2 className="mb-0.5 font-semibold text-xl tracking-tight">
          Need more? Upgrade to Pro
        </h2>
        <p className="text-muted-foreground text-sm">
          Ideal for teams that require more customization, SLAs, and support.
        </p>

        <ul className="mt-5 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-2 text-muted-foreground text-sm lg:grid-cols-2">
          {proFeatures.map((feature, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={i} className="flex items-center gap-2">
              <CheckIcon className="size-4 text-success-text" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button variant="outline" asChild className="gap-2 bg-background">
        <Link href={PRO_CONTACT_US_URL} target="_blank">
          Contact Us
        </Link>
      </Button>
    </div>
  );
}

function getPlanCta(
  currentPlan: Team["billingPlan"],
  targetPlan: Team["billingPlan"],
  isScheduledToCancel: boolean,
): CtaLink | undefined {
  // if any of the plan is pro - show contact us
  if (currentPlan === "pro" || targetPlan === "pro") {
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
