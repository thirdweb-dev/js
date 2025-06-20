"use client";

import Link from "next/link";
import { pollWithTimeout } from "utils/pollWithTimeout";
import {
  reportOnboardingPlanSelected,
  reportOnboardingPlanSelectionSkipped,
} from "@/analytics/report";
import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useStripeRedirectEvent } from "../../../../../(stripe)/stripe-redirect/stripeRedirectChannel";

export function PlanSelector(props: {
  team: Team;
  getTeam: () => Promise<Team>;
}) {
  const router = useDashboardRouter();

  useStripeRedirectEvent(async () => {
    // poll until the team has a non-free billing plan with a timeout of 5 seconds
    await pollWithTimeout({
      shouldStop: async () => {
        const team = await props.getTeam();
        const isNonFreePlan = team.billingPlan !== "free";

        if (isNonFreePlan) {
          router.replace(`/get-started/team/${props.team.slug}/add-members`);
        }

        return isNonFreePlan;
      },
      timeoutMs: 20_000,
    });
  });

  const starterPlan = (
    <PricingCard
      billingPlan="starter"
      billingStatus={props.team.billingStatus}
      cta={{
        label: "Get Started",
        onClick() {
          reportOnboardingPlanSelected({
            plan: "starter",
          });
        },
        type: "checkout",
      }}
      getTeam={props.getTeam}
      teamId={props.team.id}
      teamSlug={props.team.slug}
    />
  );

  const growthPlan = (
    <PricingCard
      billingPlan="growth"
      billingStatus={props.team.billingStatus}
      cta={{
        label: "Get Started",
        onClick() {
          reportOnboardingPlanSelected({
            plan: "growth",
          });
        },
        type: "checkout",
      }}
      getTeam={props.getTeam}
      highlighted
      teamId={props.team.id}
      teamSlug={props.team.slug}
    />
  );

  const scalePlan = (
    <PricingCard
      billingPlan="scale"
      billingStatus={props.team.billingStatus}
      cta={{
        label: "Get started",
        onClick() {
          reportOnboardingPlanSelected({
            plan: "scale",
          });
        },
        type: "checkout",
      }}
      getTeam={props.getTeam}
      teamId={props.team.id}
      teamSlug={props.team.slug}
    />
  );

  const proPlan = (
    <PricingCard
      billingPlan="pro"
      billingStatus={props.team.billingStatus}
      cta={{
        label: "Get started",
        onClick() {
          reportOnboardingPlanSelected({
            plan: "pro",
          });
        },
        type: "checkout",
      }}
      getTeam={props.getTeam}
      teamId={props.team.id}
      teamSlug={props.team.slug}
    />
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {starterPlan}
      {growthPlan}
      {scalePlan}
      {proPlan}
      <div className="col-span-1 flex flex-col gap-2 md:col-span-4">
        <div className="relative">
          <Separator className="my-4" orientation="horizontal" />
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 bg-background px-1 text-muted-foreground text-sm">
            or
          </div>
        </div>
        <Button
          asChild
          className="self-center text-muted-foreground"
          variant="link"
        >
          <Link
            href={`/get-started/team/${props.team.slug}/add-members`}
            onClick={() => {
              reportOnboardingPlanSelectionSkipped();
            }}
            replace
          >
            Skip picking a plan for now and upgrade later
          </Link>
        </Button>
      </div>
    </div>
  );
}
