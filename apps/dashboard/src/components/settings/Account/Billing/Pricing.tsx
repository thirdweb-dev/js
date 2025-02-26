"use client";

import type { GetBillingCheckoutUrlAction } from "@/actions/billing";
import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useMemo, useTransition } from "react";
import { useStripeRedirectEvent } from "../../../../app/stripe-redirect/stripeRedirectChannel";
import { getValidTeamPlan } from "../../../../app/team/components/TeamHeader/getValidTeamPlan";

// TODO - move this in app router folder in other pr

interface BillingPricingProps {
  team: Team;
  trialPeriodEndedAt: string | undefined;
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
}

type CtaLink = {
  label: string;
};

export const BillingPricing: React.FC<BillingPricingProps> = ({
  team,
  trialPeriodEndedAt,
  getBillingCheckoutUrl,
}) => {
  const validTeamPlan = getValidTeamPlan(team);
  const [isPending, startTransition] = useTransition();
  const contactUsHref = "/contact-us";
  const router = useDashboardRouter();
  useStripeRedirectEvent(() => {
    setTimeout(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 1000);
  });

  const starterCta: CtaLink | undefined = useMemo(() => {
    switch (validTeamPlan) {
      // free > starter
      case "free": {
        return {
          label: "Get started for free",
        };
      }

      // starter > starter
      case "starter": {
        return undefined;
      }

      // growth > starter
      case "growth": {
        return {
          label: "Downgrade",
        };
      }

      // pro > starter
      case "pro": {
        return {
          label: "Contact us",
          target: "_blank",
        };
      }
    }
  }, [validTeamPlan]);

  const growthCardCta: CtaLink | undefined = useMemo(() => {
    switch (validTeamPlan) {
      // free > growth
      case "free": {
        return {
          label: "Get started",
        };
      }

      // starter > growth
      case "starter": {
        return {
          label: "Upgrade",
        };
      }

      // growth > growth
      case "growth": {
        return undefined;
      }

      // pro > growth
      case "pro": {
        return {
          label: "Contact us",
          target: "_blank",
        };
      }
    }
  }, [validTeamPlan]);

  const proCta: CtaLink | undefined = useMemo(() => {
    // pro > pro
    if (validTeamPlan === "pro") {
      return undefined;
    }

    // others
    return {
      label: "Contact us",
      href: contactUsHref,
    };
  }, [validTeamPlan]);

  return (
    <div>
      <h2 className="mb-2 inline-flex items-center gap-3 font-semibold text-2xl tracking-tight">
        {validTeamPlan === "free" ? "Select a Plan" : "Plans"}{" "}
        {isPending && <Spinner className="size-5" />}
      </h2>
      <p className="text-muted-foreground">
        Upgrade or downgrade your plan here to better fit your needs.
      </p>
      <div className="h-3" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Starter */}
        <PricingCard
          billingPlan="starter"
          current={validTeamPlan === "starter"}
          cta={
            starterCta
              ? {
                  title: starterCta.label,
                  tracking: {
                    category: "account",
                    label: "starterPlan",
                  },
                }
              : undefined
          }
          teamSlug={team.slug}
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
            growthCardCta
              ? {
                  title: growthCardCta.label,
                  tracking: {
                    category: "account",
                    label: "growthPlan",
                  },
                  variant: "default",
                  hint: undefined,
                }
              : undefined
          }
          // upsell growth plan if user is on free plan
          highlighted={validTeamPlan === "free" || validTeamPlan === "starter"}
          teamSlug={team.slug}
          getBillingCheckoutUrl={getBillingCheckoutUrl}
        />

        <PricingCard
          billingPlan="pro"
          teamSlug={team.slug}
          current={validTeamPlan === "pro"}
          cta={
            proCta
              ? {
                  title: proCta.label,
                  tracking: {
                    category: "account",
                    label: "proPlan",
                  },
                }
              : undefined
          }
          getBillingCheckoutUrl={getBillingCheckoutUrl}
        />
      </div>
    </div>
  );
};
