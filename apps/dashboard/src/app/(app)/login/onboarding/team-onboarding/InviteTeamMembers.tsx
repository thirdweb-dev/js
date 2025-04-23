"use client";

import type { GetBillingCheckoutUrlAction } from "@/actions/billing";
import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TabButtons } from "@/components/ui/tabs";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { TrackingParams } from "hooks/analytics/useTrack";
import { ArrowRightIcon, CircleArrowUpIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { pollWithTimeout } from "utils/pollWithTimeout";
import { useStripeRedirectEvent } from "../../../stripe-redirect/stripeRedirectChannel";
import {
  InviteSection,
  type InviteTeamMembersFn,
} from "../../../team/[team_slug]/(team)/~/settings/members/InviteSection";

export function InviteTeamMembersUI(props: {
  team: Team;
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
  inviteTeamMembers: InviteTeamMembersFn;
  onComplete: () => void;
  getTeam: () => Promise<Team>;
  trackEvent: (params: TrackingParams) => void;
}) {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useDashboardRouter();
  const [isPollingTeam, setIsPollingTeam] = useState(false);
  const [hasSentInvites, setHasSentInvites] = useState(false);

  const showSpinner = isPollingTeam || isPending;

  useStripeRedirectEvent(async () => {
    setShowPlanModal(false);
    setIsPollingTeam(true);

    // poll until the team has a non-free billing plan with a timeout of 5 seconds
    await pollWithTimeout({
      shouldStop: async () => {
        const team = await props.getTeam();
        const isNonFreePlan = team.billingPlan !== "free";

        if (isNonFreePlan) {
          props.trackEvent({
            category: "teamOnboarding",
            action: "upgradePlan",
            label: "success",
            plan: team.billingPlan,
          });
        }

        return isNonFreePlan;
      },
      timeoutMs: 5000,
    });
    setIsPollingTeam(false);

    // refresh the page to get the latest team data
    startTransition(() => {
      router.refresh();
    });
  });

  return (
    <div className="relative flex grow flex-col">
      <Sheet open={showPlanModal} onOpenChange={setShowPlanModal}>
        <SheetContent className="!max-w-[1300px] w-full overflow-auto">
          <InviteModalContent
            billingStatus={props.team.billingStatus}
            teamSlug={props.team.slug}
            getBillingCheckoutUrl={props.getBillingCheckoutUrl}
            trackEvent={props.trackEvent}
            getTeam={props.getTeam}
            teamId={props.team.id}
          />
        </SheetContent>
      </Sheet>

      <InviteSection
        inviteTeamMembers={props.inviteTeamMembers}
        team={props.team}
        userHasEditPermission={true}
        onInviteSuccess={() => setHasSentInvites(true)}
        shouldHideInviteButton={hasSentInvites}
        customCTASection={
          <div className="flex gap-3">
            {props.team.billingPlan === "free" && (
              <Button
                size="sm"
                variant="default"
                className="gap-2"
                onClick={() => {
                  setShowPlanModal(true);
                  props.trackEvent({
                    category: "teamOnboarding",
                    action: "upgradePlan",
                    label: "openModal",
                  });
                }}
              >
                <CircleArrowUpIcon className="size-4" />
                Upgrade
              </Button>
            )}

            <Button
              onClick={() => {
                props.onComplete();
                if (!hasSentInvites) {
                  props.trackEvent({
                    category: "teamOnboarding",
                    action: "inviteTeamMembers",
                    label: "skip",
                  });
                }
              }}
              className="gap-2"
              size="sm"
              variant={hasSentInvites ? "default" : "outline"}
            >
              {hasSentInvites ? "Continue to dashboard" : "Skip for now"}
              {hasSentInvites && <ArrowRightIcon className="size-4" />}
            </Button>
          </div>
        }
      />

      {showSpinner && (
        <div className="absolute top-6 right-6">
          <Spinner className="size-5" />{" "}
        </div>
      )}
    </div>
  );
}

function InviteModalContent(props: {
  teamSlug: string;
  billingStatus: Team["billingStatus"];
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
  trackEvent: (params: TrackingParams) => void;
  getTeam: () => Promise<Team>;
  teamId: string;
}) {
  const [planToShow, setPlanToShow] = useState<
    "starter" | "growth" | "accelerate" | "scale"
  >("growth");

  const starterPlan = (
    <PricingCard
      billingPlan="starter"
      billingStatus={props.billingStatus}
      teamSlug={props.teamSlug}
      cta={{
        label: "Get Started",
        type: "checkout",
        onClick() {
          props.trackEvent({
            category: "teamOnboarding",
            action: "upgradePlan",
            label: "attempt",
            plan: "starter",
          });
        },
      }}
      getBillingCheckoutUrl={props.getBillingCheckoutUrl}
      getTeam={props.getTeam}
      teamId={props.teamId}
    />
  );

  const growthPlan = (
    <PricingCard
      billingPlan="growth"
      billingStatus={props.billingStatus}
      teamSlug={props.teamSlug}
      cta={{
        label: "Get Started",
        type: "checkout",
        onClick() {
          props.trackEvent({
            category: "teamOnboarding",
            action: "upgradePlan",
            label: "attempt",
            plan: "growth",
          });
        },
      }}
      highlighted
      getBillingCheckoutUrl={props.getBillingCheckoutUrl}
      getTeam={props.getTeam}
      teamId={props.teamId}
    />
  );

  const acceleratePlan = (
    <PricingCard
      billingPlan="accelerate"
      billingStatus={props.billingStatus}
      teamSlug={props.teamSlug}
      cta={{
        label: "Get started",
        type: "checkout",
        onClick() {
          props.trackEvent({
            category: "teamOnboarding",
            action: "upgradePlan",
            label: "attempt",
            plan: "accelerate",
          });
        },
      }}
      getBillingCheckoutUrl={props.getBillingCheckoutUrl}
      getTeam={props.getTeam}
      teamId={props.teamId}
    />
  );

  const scalePlan = (
    <PricingCard
      billingPlan="scale"
      billingStatus={props.billingStatus}
      teamSlug={props.teamSlug}
      cta={{
        label: "Get started",
        type: "checkout",
        onClick() {
          props.trackEvent({
            category: "teamOnboarding",
            action: "upgradePlan",
            label: "attempt",
            plan: "scale",
          });
        },
      }}
      getBillingCheckoutUrl={props.getBillingCheckoutUrl}
      getTeam={props.getTeam}
      teamId={props.teamId}
    />
  );

  return (
    <div>
      <SheetHeader className="space-y-0.5">
        <SheetTitle className="text-left text-2xl tracking-tight">
          Choose a plan
        </SheetTitle>
        <SheetDescription className="text-left leading-relaxed">
          Get started with the free Starter plan or upgrade to Growth plan for
          increased limits and advanced features.{" "}
          <UnderlineLink href="https://thirdweb.com/pricing" target="_blank">
            Learn more about pricing
          </UnderlineLink>
        </SheetDescription>
      </SheetHeader>

      <div className="h-5" />

      {/* Desktop */}
      <div className="hidden grid-cols-1 gap-6 md:grid-cols-4 md:gap-4 lg:grid">
        {starterPlan}
        {growthPlan}
        {acceleratePlan}
        {scalePlan}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <TabButtons
          tabs={[
            {
              name: "Starter",
              onClick: () => setPlanToShow("starter"),
              isActive: planToShow === "starter",
            },
            {
              name: "Growth",
              onClick: () => setPlanToShow("growth"),
              isActive: planToShow === "growth",
            },
            {
              name: "Accelerate",
              onClick: () => setPlanToShow("accelerate"),
              isActive: planToShow === "accelerate",
            },
            {
              name: "Scale",
              onClick: () => setPlanToShow("scale"),
              isActive: planToShow === "scale",
            },
          ]}
        />
        <div className="h-4" />
        {planToShow === "starter" && starterPlan}
        {planToShow === "growth" && growthPlan}
        {planToShow === "accelerate" && acceleratePlan}
        {planToShow === "scale" && scalePlan}
      </div>
    </div>
  );
}
