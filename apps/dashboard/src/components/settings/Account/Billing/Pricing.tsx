import type { Team } from "@/api/team";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { useMemo } from "react";
import { getValidTeamPlan } from "../../../../app/team/components/TeamHeader/getValidTeamPlan";
import { CONTACT_US_URL } from "../../../../utils/pricing";

// TODO - move this in app router folder in other pr

interface BillingPricingProps {
  team: Team;
  trialPeriodEndedAt: string | undefined;
}

type CtaLink = {
  label: string;
  href: string;
  target?: "_blank";
};

export const BillingPricing: React.FC<BillingPricingProps> = ({
  team,
  trialPeriodEndedAt,
}) => {
  const validTeamPlan = getValidTeamPlan(team);
  const starterPlanSubscribeRoute = `/team/${team.slug}/billing/subscribe/plan:starter`;
  const growthPlanSubscribeRoute = `/team/${team.slug}/billing/subscribe/plan:growth`;
  const contactUsHref = "/contact-us";

  const starterCta: CtaLink | undefined = useMemo(() => {
    switch (validTeamPlan) {
      // free > starter
      case "free": {
        return {
          label: "Get started for free",
          href: starterPlanSubscribeRoute,
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
          href: starterPlanSubscribeRoute,
        };
      }

      // pro > starter
      case "pro": {
        return {
          label: "Contact us",
          href: contactUsHref,
          target: "_blank",
        };
      }
    }
  }, [validTeamPlan, starterPlanSubscribeRoute]);

  const growthCardCta: CtaLink | undefined = useMemo(() => {
    const trialTitle = "Claim your 1-month free";

    switch (validTeamPlan) {
      // free > growth
      case "free": {
        return {
          label: team.growthTrialEligible ? trialTitle : "Get started",
          href: growthPlanSubscribeRoute,
        };
      }

      // starter > growth
      case "starter": {
        return {
          label: team.growthTrialEligible ? trialTitle : "Upgrade",
          href: growthPlanSubscribeRoute,
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
          href: contactUsHref,
          target: "_blank",
        };
      }
    }
  }, [team, validTeamPlan, growthPlanSubscribeRoute]);

  const proCta: CtaLink | undefined = useMemo(() => {
    // pro > pro
    if (validTeamPlan === "pro") {
      return undefined;
    }

    // others
    return {
      label: "Contact us",
      href: contactUsHref,
      target: "_blank",
    };
  }, [validTeamPlan]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Starter */}
      <PricingCard
        billingPlan="starter"
        current={validTeamPlan === "starter"}
        cta={
          starterCta
            ? {
                title: starterCta.label,
                href: starterCta.href,
                target: starterCta.target,
                tracking: {
                  category: "account",
                  label: "starterPlan",
                },
              }
            : undefined
        }
        team={team}
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
                href: growthCardCta.href,
                target: growthCardCta.target,
                tracking: {
                  category: "account",
                  label: team.growthTrialEligible
                    ? "claimGrowthTrial"
                    : "growthPlan",
                },
                variant: "default",
                hint: team.growthTrialEligible
                  ? "Your free trial will end after 30 days."
                  : undefined,
              }
            : undefined
        }
        canTrialGrowth={team.growthTrialEligible || false}
        // upsell growth plan if user is on free plan
        highlighted={validTeamPlan === "free"}
        team={team}
      />

      <PricingCard
        billingPlan="pro"
        current={validTeamPlan === "pro"}
        cta={
          proCta
            ? {
                title: proCta.label,
                target: proCta.target,
                href: CONTACT_US_URL,
                tracking: {
                  category: "account",
                  label: "proPlan",
                },
              }
            : undefined
        }
      />
    </div>
  );
};
