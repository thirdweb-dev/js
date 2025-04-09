"use client";

import type { GetBillingCheckoutUrlAction } from "@/actions/billing";
import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useStripeRedirectEvent } from "../../../../app/stripe-redirect/stripeRedirectChannel";
import { getValidTeamPlan } from "../../../../app/team/components/TeamHeader/getValidTeamPlan";
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
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
}

type CtaLink =
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
  getBillingCheckoutUrl,
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

  const starterCta = getPlanCta(validTeamPlan, "starter");
  const growthCta = getPlanCta(validTeamPlan, "growth");
  const accelerateCta = getPlanCta(validTeamPlan, "accelerate");
  const scaleCta = getPlanCta(validTeamPlan, "scale");

  const highlightGrowthPlan =
    validTeamPlan === "free" ||
    validTeamPlan === "starter" ||
    validTeamPlan === "growth_legacy";

  const highlightStarterPlan = validTeamPlan === "starter_legacy";

  const highlightAcceleratePlan = validTeamPlan === "growth";
  const highlightScalePlan = validTeamPlan === "accelerate";

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
          current={validTeamPlan === "starter"}
          cta={
            starterCta?.type === "checkout"
              ? {
                  type: "checkout",
                  title: starterCta.label,
                }
              : starterCta?.type === "link"
                ? {
                    type: "link",
                    title: starterCta.label,
                    href: starterCta.href,
                  }
                : undefined
          }
          teamSlug={team.slug}
          highlighted={highlightStarterPlan}
          getBillingCheckoutUrl={getBillingCheckoutUrl}
        />

        {/* Growth */}
        <PricingCard
          billingPlan="growth"
          activeTrialEndsAt={
            validTeamPlan === "growth" ? trialPeriodEndedAt : undefined
          }
          current={validTeamPlan === "growth"}
          cta={
            growthCta?.type === "checkout"
              ? {
                  type: "checkout",
                  title: growthCta.label,
                }
              : growthCta?.type === "link"
                ? {
                    type: "link",
                    title: growthCta.label,
                    href: growthCta.href,
                  }
                : undefined
          }
          highlighted={highlightGrowthPlan}
          teamSlug={team.slug}
          getBillingCheckoutUrl={getBillingCheckoutUrl}
        />

        {/* Accelerate */}
        <PricingCard
          billingPlan="accelerate"
          teamSlug={team.slug}
          current={validTeamPlan === "accelerate"}
          cta={
            accelerateCta?.type === "checkout"
              ? {
                  title: accelerateCta.label,
                  type: "checkout",
                }
              : accelerateCta?.type === "link"
                ? {
                    title: accelerateCta.label,
                    type: "link",
                    href: accelerateCta.href,
                  }
                : undefined
          }
          highlighted={highlightAcceleratePlan}
          getBillingCheckoutUrl={getBillingCheckoutUrl}
        />

        {/* Scale */}
        <PricingCard
          billingPlan="scale"
          teamSlug={team.slug}
          current={validTeamPlan === "scale"}
          cta={
            scaleCta?.type === "checkout"
              ? {
                  title: scaleCta.label,
                  type: "checkout",
                }
              : scaleCta?.type === "link"
                ? {
                    title: scaleCta.label,
                    type: "link",
                    href: scaleCta.href,
                  }
                : undefined
          }
          highlighted={highlightScalePlan}
          getBillingCheckoutUrl={getBillingCheckoutUrl}
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
): CtaLink | undefined {
  // if any of the plan is pro - show contact us
  if (currentPlan === "pro" || targetPlan === "pro") {
    return {
      label: "Contact us",
      href: PRO_CONTACT_US_URL,
      type: "link",
    };
  }

  // if both same plan - return undefined
  if (currentPlan === targetPlan) {
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
