"use client";
import { Button } from "@/components/ui/button";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { ArrowRightIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { TitleAndDescription } from "./Title";

function OnboardingChoosePlan(props: {
  skipPlan: () => void;
  canTrialGrowth: boolean;
}) {
  const params = useParams<{ team_slug: string }>();
  return (
    <div>
      <TitleAndDescription
        heading="Choose your plan"
        description="Get started for free with our Starter plan or subscribe to Growth plan to unlock higher rate limits and advanced features."
      />

      <Button
        variant="ghost"
        onClick={props.skipPlan}
        className="absolute top-4 right-4 inline-flex items-center gap-2"
      >
        Continue with free plan <ArrowRightIcon className="size-4" />
      </Button>

      <div className="h-4" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PricingCard
          billingPlan="starter"
          teamSlug={params?.team_slug ?? undefined}
          cta={{
            title: "Get started for free",
            href: "/team/~/~/settings/billing",
            tracking: {
              category: "account",
            },
          }}
          onClick={props.skipPlan}
        />

        <PricingCard
          billingPlan="growth"
          teamSlug={params?.team_slug ?? undefined}
          cta={{
            title: "Claim your 1-month free",
            hint: "Your free trial will end after 30 days.",
            tracking: {
              category: "account",
              label: "growthPlan",
            },
            href: "/team/~/~/settings/billing",
            variant: "default",
          }}
          canTrialGrowth={props.canTrialGrowth}
          onClick={props.skipPlan}
        />
      </div>
    </div>
  );
}

export default OnboardingChoosePlan;
