"use client";

import { differenceInDays, format, isAfter } from "date-fns";
import {
  CircleAlertIcon,
  CreditCardIcon,
  FileTextIcon,
  SquarePenIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { BillingPortalButton } from "@/components/billing/billing";
import { CancelPlanButton } from "@/components/billing/CancelPlanModal/CancelPlanModal";
import { BillingPricing } from "@/components/billing/Pricing";
import { RenewSubscriptionButton } from "@/components/billing/renew-subscription/renew-subscription-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { getValidTeamPlan } from "@/utils/getValidTeamPlan";

export function PlanInfoCardUI(props: {
  subscriptions: TeamSubscription[];
  team: Team;
  getTeam: () => Promise<Team>;
  openPlanSheetButtonByDefault: boolean;
  highlightPlan: Team["billingPlan"] | undefined;
  isOwnerAccount: boolean;
}) {
  const { subscriptions, team, openPlanSheetButtonByDefault } = props;
  const validPlan = getValidTeamPlan(team);
  const isActualFreePlan = team.billingPlan === "free";
  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(
    openPlanSheetButtonByDefault,
  );

  const planSub = subscriptions.find(
    (subscription) => subscription.type === "PLAN",
  );

  // considers hours, mins ... etc as well
  const trialEndsInFuture =
    planSub?.trialEnd && isAfter(new Date(planSub.trialEnd), new Date());

  const trialEndsAfterDays = planSub?.trialEnd
    ? differenceInDays(new Date(planSub.trialEnd), new Date())
    : 0;

  return (
    <div className="rounded-lg border border-border bg-card">
      <ViewPlansSheet
        getTeam={props.getTeam}
        highlightPlan={props.highlightPlan}
        isOpen={isPlanSheetOpen}
        onOpenChange={setIsPlanSheetOpen}
        team={team}
        trialPeriodEndedAt={planSub?.trialEnd ?? undefined}
      />

      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div>
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-2xl capitalize tracking-tight">
                {validPlan === "growth_legacy" ? "Growth" : validPlan} Plan
              </h3>
              {validPlan.includes("legacy") && (
                <Badge variant="warning">Legacy</Badge>
              )}
              {trialEndsInFuture && <Badge variant="default">Trial</Badge>}
            </div>

            {validPlan.includes("legacy") && (
              <p className="text-sm text-yellow-600">
                You are on the legacy plan. You may save by upgrading to new
                plan.{" "}
                <UnderlineLink
                  className="decoration-yellow-600/50"
                  href="/pricing"
                >
                  Learn More
                </UnderlineLink>
              </p>
            )}
          </div>

          {trialEndsAfterDays > 0 && (
            <p className="text-blue-500 text-sm">
              Your trial ends in {trialEndsAfterDays} days
            </p>
          )}
          {props.team.planCancellationDate && (
            <Badge variant="destructive">
              Scheduled to cancel in{" "}
              {differenceInDays(
                new Date(props.team.planCancellationDate),
                new Date(),
              )}{" "}
              days
            </Badge>
          )}
        </div>

        {props.team.billingPlan !== "free" && (
          <div className="flex items-center gap-3">
            <ToolTipLabel
              label={
                props.isOwnerAccount
                  ? null
                  : "Only team owners can change plans."
              }
            >
              <div>
                <Button
                  className="gap-2 bg-background"
                  disabled={!props.isOwnerAccount}
                  onClick={() => {
                    setIsPlanSheetOpen(true);
                  }}
                  size="sm"
                  variant="outline"
                >
                  <SquarePenIcon className="size-4 text-muted-foreground" />
                  Change Plan
                </Button>
              </div>
            </ToolTipLabel>

            <ToolTipLabel
              label={
                props.isOwnerAccount
                  ? null
                  : props.team.planCancellationDate
                    ? "Only team owners can renew plans."
                    : "Only team owners can cancel plans."
              }
            >
              <div>
                {props.team.planCancellationDate ? (
                  <RenewSubscriptionButton
                    disabled={!props.isOwnerAccount}
                    getTeam={props.getTeam}
                    teamId={props.team.id}
                  />
                ) : (
                  <CancelPlanButton
                    billingStatus={props.team.billingStatus}
                    currentPlan={props.team.billingPlan}
                    disabled={!props.isOwnerAccount}
                    getTeam={props.getTeam}
                    teamId={props.team.id}
                    teamSlug={props.team.slug}
                  />
                )}
              </div>
            </ToolTipLabel>
          </div>
        )}
      </div>

      <Separator />

      <div className="p-4 lg:p-6">
        {isActualFreePlan ? (
          <div className="flex flex-col items-center py-8 text-center max-sm:gap-4">
            <CircleAlertIcon className="mb-3 text-muted-foreground lg:size-6" />
            <p>Your plan includes a fixed amount of free usage.</p>
            <p>
              To unlock additional usage, upgrade your plan to Starter or
              Growth.
            </p>

            <div className="mt-4">
              <ToolTipLabel
                label={
                  props.isOwnerAccount
                    ? null
                    : "Only team owners can change plans."
                }
              >
                <div>
                  <Button
                    disabled={!props.isOwnerAccount}
                    onClick={() => {
                      setIsPlanSheetOpen(true);
                    }}
                    size="sm"
                    variant="default"
                  >
                    Select a plan
                  </Button>
                </div>
              </ToolTipLabel>
            </div>
          </div>
        ) : (
          <BillingInfo
            subscriptions={subscriptions}
            teamSlug={props.team.slug}
          />
        )}
      </div>

      {props.team.billingPlan !== "free" && (
        <div className="flex flex-col gap-4 border-t p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <p className="text-muted-foreground text-sm">
            <span>
              Adjust your plan to avoid unnecessary charges.{" "}
              <br className="max-sm:hidden" /> For more details, see{" "}
            </span>
            <span>
              <UnderlineLink
                className="underline underline-offset-2 hover:text-foreground"
                href="https://portal.thirdweb.com/account/billing/manage-billing"
                rel="noopener noreferrer"
                target="_blank"
              >
                {" "}
                how to manage billing
              </UnderlineLink>{" "}
            </span>
          </p>

          <div className="flex items-center gap-3">
            <Button
              asChild
              className="gap-2 bg-background"
              size="sm"
              variant="outline"
            >
              <Link href={`/team/${team.slug}/~/billing/invoices`}>
                <FileTextIcon className="size-4 text-muted-foreground" />
                View Invoices
              </Link>
            </Button>

            {/* manage team billing */}
            <ToolTipLabel
              label={
                props.isOwnerAccount
                  ? null
                  : "Only team owners can manage billing."
              }
            >
              <div>
                <BillingPortalButton
                  buttonProps={{
                    className: "bg-background gap-2",
                    disabled: !props.isOwnerAccount,
                    size: "sm",
                    variant: "outline",
                  }}
                  teamSlug={team.slug}
                >
                  <CreditCardIcon className="size-4 text-muted-foreground" />
                  Manage Billing
                </BillingPortalButton>
              </div>
            </ToolTipLabel>
          </div>
        </div>
      )}
    </div>
  );
}

function BillingInfo({
  subscriptions,
  teamSlug,
}: {
  subscriptions: TeamSubscription[];
  teamSlug: string;
}) {
  const planSubscription = subscriptions.find(
    (subscription) => subscription.type === "PLAN",
  );

  const usageSubscription = subscriptions.find(
    (subscription) => subscription.type === "USAGE",
  );

  return (
    <div>
      {planSubscription && (
        <SubscriptionOverview subscription={planSubscription} title="Plan" />
      )}

      {usageSubscription && (
        <>
          <Separator className="my-4" />
          <SubscriptionOverview
            subscription={usageSubscription}
            title={
              <div className="flex items-center">
                <h5 className="mr-1 font-medium text-base">Usage</h5>{" "}
                <span className="text-muted-foreground text-sm">
                  -{" "}
                  <Link
                    className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
                    href={`/team/${teamSlug}/~/usage`}
                  >
                    View Breakdown
                  </Link>
                </span>
              </div>
            }
          />
        </>
      )}
    </div>
  );
}

function SubscriptionOverview(props: {
  subscription: TeamSubscription;
  title?: string | React.ReactNode;
}) {
  const { subscription } = props;

  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div>
          {props.title &&
            (typeof props.title === "string" ? (
              <h5 className="font-medium text-base">{props.title}</h5>
            ) : (
              props.title
            ))}
          <p className="text-muted-foreground text-sm">
            Your next billing period begins{" "}
            {format(
              new Date(props.subscription.currentPeriodEnd),
              "MMMM dd, yyyy",
            )}
          </p>
        </div>

        <p className="text-foreground">
          {formatCurrencyAmount(
            subscription.upcomingInvoice.amount || 0,
            subscription.upcomingInvoice.currency,
          )}
        </p>
      </div>
    </div>
  );
}

function formatCurrencyAmount(centsAmount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    currency: currency,
    style: "currency",
  }).format(centsAmount / 100);
}

function ViewPlansSheet(props: {
  team: Team;
  trialPeriodEndedAt: string | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getTeam: () => Promise<Team>;
  highlightPlan: Team["billingPlan"] | undefined;
}) {
  return (
    <Sheet onOpenChange={props.onOpenChange} open={props.isOpen}>
      <SheetContent className="!max-w-[1300px] w-full overflow-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>Manage plans</SheetTitle>
        </SheetHeader>
        <BillingPricing
          getTeam={props.getTeam}
          highlightPlan={props.highlightPlan}
          team={props.team}
          trialPeriodEndedAt={props.trialPeriodEndedAt}
        />
      </SheetContent>
    </Sheet>
  );
}
