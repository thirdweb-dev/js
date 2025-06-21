"use client";

import { ArrowRightIcon, CircleArrowUpIcon } from "lucide-react";
import { useState, useTransition } from "react";
import type { ThirdwebClient } from "thirdweb";
import { pollWithTimeout } from "utils/pollWithTimeout";
import {
  reportOnboardingMembersInvited,
  reportOnboardingMembersSkipped,
  reportOnboardingMembersUpsellButtonClicked,
  reportOnboardingMembersUpsellPlanSelected,
} from "@/analytics/report";
import type { Team } from "@/api/team";
import { PricingCard } from "@/components/blocks/pricing-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TabButtons } from "@/components/ui/tabs";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useStripeRedirectEvent } from "../../../(stripe)/stripe-redirect/stripeRedirectChannel";
import {
  InviteSection,
  type InviteTeamMembersFn,
} from "../../../team/[team_slug]/(team)/~/settings/members/InviteSection";

export function InviteTeamMembersUI(props: {
  team: Team;
  inviteTeamMembers: InviteTeamMembersFn;
  onComplete: () => void;
  getTeam: () => Promise<Team>;
  client: ThirdwebClient;
}) {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useDashboardRouter();
  const [isPollingTeam, setIsPollingTeam] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const showSpinner = isPollingTeam || isPending;

  useStripeRedirectEvent(async () => {
    setShowPlanModal(false);
    setIsPollingTeam(true);

    // poll until the team has a non-free billing plan with a timeout of 5 seconds
    await pollWithTimeout({
      shouldStop: async () => {
        const team = await props.getTeam();
        const isNonFreePlan =
          team.billingPlan !== "free" && team.billingPlan !== "starter";

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

  const hasSentInvites = successCount > 0;

  return (
    <div className="relative flex grow flex-col">
      <Sheet onOpenChange={setShowPlanModal} open={showPlanModal}>
        <SheetContent className="!max-w-[1300px] w-full overflow-auto">
          <InviteModalContent
            billingStatus={props.team.billingStatus}
            getTeam={props.getTeam}
            teamId={props.team.id}
            teamSlug={props.team.slug}
          />
        </SheetContent>
      </Sheet>

      <InviteSection
        client={props.client}
        customCTASection={
          <div className="flex gap-3">
            {(props.team.billingPlan === "free" ||
              props.team.billingPlan === "starter") && (
              <Button
                className="gap-2"
                onClick={() => {
                  setShowPlanModal(true);
                  reportOnboardingMembersUpsellButtonClicked();
                }}
                size="sm"
                variant="default"
              >
                <CircleArrowUpIcon className="size-4" />
                Upgrade
              </Button>
            )}

            <Button
              className="gap-2"
              onClick={() => {
                props.onComplete();
                if (successCount === 0) {
                  reportOnboardingMembersSkipped();
                } else {
                  reportOnboardingMembersInvited({
                    count: successCount,
                  });
                }
              }}
              size="sm"
              variant={hasSentInvites ? "default" : "outline"}
            >
              {hasSentInvites ? "Continue to dashboard" : "Skip for now"}
              {hasSentInvites && <ArrowRightIcon className="size-4" />}
            </Button>
          </div>
        }
        inviteTeamMembers={props.inviteTeamMembers}
        onInviteSuccess={(count) =>
          setSuccessCount((prevCount) => prevCount + count)
        }
        recommendedMembers={[]}
        shouldHideInviteButton={hasSentInvites}
        // its a new team, there's no recommended members
        team={props.team}
        userHasEditPermission={true}
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
  getTeam: () => Promise<Team>;
  teamId: string;
}) {
  const [planToShow, setPlanToShow] = useState<"growth" | "scale" | "pro">(
    "growth",
  );

  const growthPlan = (
    <PricingCard
      billingPlan="growth"
      billingStatus={props.billingStatus}
      cta={{
        label: "Get Started",
        onClick() {
          reportOnboardingMembersUpsellPlanSelected({
            plan: "growth",
          });
        },
        type: "checkout",
      }}
      getTeam={props.getTeam}
      highlighted
      teamId={props.teamId}
      teamSlug={props.teamSlug}
    />
  );

  const scalePlan = (
    <PricingCard
      billingPlan="scale"
      billingStatus={props.billingStatus}
      cta={{
        label: "Get started",
        onClick() {
          reportOnboardingMembersUpsellPlanSelected({
            plan: "scale",
          });
        },
        type: "checkout",
      }}
      getTeam={props.getTeam}
      teamId={props.teamId}
      teamSlug={props.teamSlug}
    />
  );

  const proPlan = (
    <PricingCard
      billingPlan="pro"
      billingStatus={props.billingStatus}
      cta={{
        label: "Get started",
        onClick() {
          reportOnboardingMembersUpsellPlanSelected({
            plan: "pro",
          });
        },
        type: "checkout",
      }}
      getTeam={props.getTeam}
      teamId={props.teamId}
      teamSlug={props.teamSlug}
    />
  );

  return (
    <div>
      <SheetHeader className="space-y-0.5">
        <SheetTitle className="text-left text-2xl tracking-tight">
          Choose a plan
        </SheetTitle>
        <SheetDescription className="text-left leading-relaxed">
          Upgrade to the Growth plan to unlock team members and advanced
          features.{" "}
          <UnderlineLink
            href="https://thirdweb.com/pricing"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more about pricing
          </UnderlineLink>
        </SheetDescription>
      </SheetHeader>

      <div className="h-5" />

      {/* Desktop */}
      <div className="hidden grid-cols-1 gap-6 md:grid-cols-4 md:gap-4 lg:grid">
        {growthPlan}
        {scalePlan}
        {proPlan}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <TabButtons
          tabs={[
            {
              isActive: planToShow === "growth",
              name: "Growth",
              onClick: () => setPlanToShow("growth"),
            },
            {
              isActive: planToShow === "scale",
              name: "Scale",
              onClick: () => setPlanToShow("scale"),
            },
            {
              isActive: planToShow === "pro",
              name: "Pro",
              onClick: () => setPlanToShow("pro"),
            },
          ]}
        />
        <div className="h-4" />
        {planToShow === "growth" && growthPlan}
        {planToShow === "scale" && scalePlan}
        {planToShow === "pro" && proPlan}
      </div>
    </div>
  );
}
