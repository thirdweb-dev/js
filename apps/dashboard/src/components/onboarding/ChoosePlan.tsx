"use client";
import { Button } from "@/components/ui/button";
import { PricingCard } from "components/homepage/sections/PricingCard";
import { ArrowRightIcon } from "lucide-react";
import { TitleAndDescription } from "./Title";

export function OnboardingChoosePlan(props: {
  skipPlan: () => Promise<void>;
  canTrialGrowth: boolean;
  teamSlug: string;
}) {
  return (
    <div>
      <TitleAndDescription
        heading="Choose your Plan"
        description="Get started for free with our Starter plan or subscribe to Growth plan to unlock higher rate limits and advanced features"
      />

      <div className="h-4" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
        <PricingCard
          billingPlan="starter"
          teamSlug={props.teamSlug}
          cta={{
            title: "Get started for free",
            tracking: {
              category: "account",
            },
          }}
        />

        <PricingCard
          billingPlan="growth"
          teamSlug={props.teamSlug}
          cta={{
            title: "Claim your 1-month free",
            hint: "Your free trial will end after 30 days.",
            tracking: {
              category: "account",
              label: "growthPlan",
            },
            variant: "default",
          }}
          canTrialGrowth={props.canTrialGrowth}
          highlighted
        />
      </div>

      <div className="h-4" />

      <div className="flex justify-center">
        <Button
          variant="link"
          onClick={props.skipPlan}
          className="inline-flex translate-x-2 items-center gap-2 text-muted-foreground"
        >
          Continue with Free Plan <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
