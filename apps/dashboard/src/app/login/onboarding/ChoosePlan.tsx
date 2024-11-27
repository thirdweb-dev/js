"use client";

import { TextDivider } from "@/components/TextDivider";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Button } from "@/components/ui/button";
import { TitleAndDescription } from "./Title";

export function OnboardingChoosePlan(props: {
  skipPlan: () => Promise<void>;
  canTrialGrowth: boolean;
  teamSlug: string;
  redirectPath: string;
}) {
  return (
    <div>
      <TitleAndDescription
        heading="Choose your Plan"
        description="Get started for free with our Starter plan or subscribe to Growth plan to unlock higher rate limits and advanced features"
      />

      <div className="h-4" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-5">
        <PricingCard
          billingPlan="starter"
          teamSlug={props.teamSlug}
          cta={{
            title: "Get started for free",
            tracking: {
              category: "account",
            },
          }}
          redirectPath={props.redirectPath}
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
          redirectPath={props.redirectPath}
        />
      </div>

      <TextDivider text="OR" className="my-4" />

      <Button
        variant="outline"
        onClick={props.skipPlan}
        className="relative h-auto w-full items-center gap-2 rounded-xl bg-muted/50 py-2.5"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-base text-foreground">Skip for now</span>
          <span className="text-muted-foreground text-sm">
            You will have limited access to services
          </span>
        </span>
      </Button>
    </div>
  );
}
