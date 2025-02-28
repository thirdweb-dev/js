"use client";

import type { RedirectBillingCheckoutAction } from "@/actions/billing";
import { TextDivider } from "@/components/TextDivider";
import { PricingCard } from "@/components/blocks/pricing-card";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/button";

export function ChooseTeamPlan(props: {
  skipPlan: () => Promise<void>;
  teamSlug: string;
  redirectPath: string;
  redirectToCheckout: RedirectBillingCheckoutAction;
}) {
  return (
    <div>
      <h3 className="mb-0.5 font-semibold text-2xl text-foreground tracking-tight">
        Choose a plan
      </h3>

      <div className="text-muted-foreground text-sm">
        Start building with the free Starter plan or upgrade to Growth for
        increased limits and advanced features.{" "}
        <UnderlineLink href="https://thirdweb.com/pricing" target="_blank">
          Learn more
        </UnderlineLink>
      </div>

      <div className="h-6" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-5">
        <PricingCard
          billingPlan="starter"
          teamSlug={props.teamSlug}
          cta={{
            title: "Get Started for free",
            tracking: {
              category: "account",
              label: "starterPlan",
            },
          }}
          redirectPath={props.redirectPath}
          redirectToCheckout={props.redirectToCheckout}
        />

        <PricingCard
          billingPlan="growth"
          teamSlug={props.teamSlug}
          cta={{
            title: "Get Started with Growth",
            tracking: {
              category: "account",
              label: "growthPlan",
            },
            variant: "default",
          }}
          highlighted
          redirectPath={props.redirectPath}
          redirectToCheckout={props.redirectToCheckout}
        />
      </div>

      <TextDivider text="OR" className="my-5" />

      <Button
        variant="outline"
        onClick={() => {
          props.skipPlan();
        }}
        className="relative h-auto w-full items-center gap-2 rounded-xl bg-card py-2.5"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-base text-foreground">Skip for now</span>
          <span className="text-muted-foreground text-sm">
            You will have limited access to services
          </span>
        </span>
      </Button>

      <div className="h-6" />
    </div>
  );
}
