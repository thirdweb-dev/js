"use client";

import type {
  GetBillingCheckoutUrlAction,
  GetBillingPortalUrlAction,
} from "@/actions/billing";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { BillingPortalButton } from "@/components/billing";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  type CancelPlan,
  CancelPlanButton,
} from "components/settings/Account/Billing/CancelPlanModal/CancelPlanModal";
import { BillingPricing } from "components/settings/Account/Billing/Pricing";
import { differenceInDays, isAfter } from "date-fns";
import { format } from "date-fns/format";
import { CreditCardIcon, FileTextIcon, SquarePenIcon } from "lucide-react";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getValidTeamPlan } from "../../../../../../components/TeamHeader/getValidTeamPlan";

export function PlanInfoCardUI(props: {
  subscriptions: TeamSubscription[];
  team: Team;
  getBillingPortalUrl: GetBillingPortalUrlAction;
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
  cancelPlan: CancelPlan;
  getTeam: () => Promise<Team>;
}) {
  const { subscriptions, team } = props;
  const validPlan = getValidTeamPlan(team);
  const isActualFreePlan = team.billingPlan === "free";
  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);

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
        team={team}
        trialPeriodEndedAt={planSub?.trialEnd ?? undefined}
        getBillingCheckoutUrl={props.getBillingCheckoutUrl}
        isOpen={isPlanSheetOpen}
        onOpenChange={setIsPlanSheetOpen}
      />

      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div>
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-2xl capitalize tracking-tight">
                {validPlan === "growth_legacy"
                  ? "Growth"
                  : validPlan === "starter_legacy"
                    ? "Starter"
                    : validPlan}{" "}
                Plan
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
                  href="/pricing"
                  className="decoration-yellow-600/50"
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
        </div>

        {props.team.billingPlan !== "free" && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-background"
              onClick={() => {
                setIsPlanSheetOpen(true);
              }}
            >
              <SquarePenIcon className="size-4 text-muted-foreground" />
              Change Plan
            </Button>

            <CancelPlanButton
              teamSlug={props.team.slug}
              billingStatus={props.team.billingStatus}
              cancelPlan={props.cancelPlan}
              currentPlan={props.team.billingPlan}
              getTeam={props.getTeam}
            />
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
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setIsPlanSheetOpen(true);
                }}
              >
                Select a plan
              </Button>
            </div>
          </div>
        ) : (
          <BillingInfo subscriptions={subscriptions} />
        )}
      </div>

      {props.team.billingPlan !== "free" && (
        <div className="flex flex-col gap-4 border-t p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <p className="text-muted-foreground text-sm">
            <span>
              Adjust your plan here to avoid unnecessary charges.{" "}
              <br className="max-sm:hidden" /> For more details, See{" "}
            </span>
            <span>
              <UnderlineLink
                href="https://portal.thirdweb.com/account/billing/manage-billing"
                target="_blank"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {" "}
                how to manage billing
              </UnderlineLink>{" "}
            </span>
          </p>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 bg-background"
            >
              <Link href={`/team/${team.slug}/~/settings/invoices`}>
                <FileTextIcon className="size-4 text-muted-foreground" />
                View Invoices
              </Link>
            </Button>

            {/* manage team billing */}
            <BillingPortalButton
              teamSlug={team.slug}
              buttonProps={{
                variant: "outline",
                size: "sm",
                className: "bg-background gap-2",
              }}
              getBillingPortalUrl={props.getBillingPortalUrl}
            >
              <CreditCardIcon className="size-4 text-muted-foreground" />
              Manage Billing
            </BillingPortalButton>
          </div>
        </div>
      )}
    </div>
  );
}

function BillingInfo({
  subscriptions,
}: {
  subscriptions: TeamSubscription[];
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
        <SubscriptionOverview subscription={planSubscription} />
      )}

      {usageSubscription && (
        <>
          <Separator className="my-4" />
          <SubscriptionOverview
            subscription={usageSubscription}
            title="On-Demand Charges"
          />
        </>
      )}
    </div>
  );
}

function SubscriptionOverview(props: {
  subscription: TeamSubscription;
  title?: string;
}) {
  const { subscription } = props;

  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div>
          {props.title && (
            <h5 className="font-medium text-base">{props.title}</h5>
          )}
          <p className="text-muted-foreground text-sm">
            {format(
              new Date(props.subscription.currentPeriodStart),
              "MMMM dd yyyy",
            )}{" "}
            -{" "}
            {format(
              new Date(props.subscription.currentPeriodEnd),
              "MMMM dd yyyy",
            )}{" "}
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
    style: "currency",
    currency: currency,
  }).format(centsAmount / 100);
}

function ViewPlansSheet(props: {
  team: Team;
  trialPeriodEndedAt: string | undefined;
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={props.isOpen} onOpenChange={props.onOpenChange}>
      <SheetContent className="!max-w-[1300px] w-full overflow-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>Manage plans</SheetTitle>
        </SheetHeader>
        <BillingPricing
          team={props.team}
          trialPeriodEndedAt={props.trialPeriodEndedAt}
          getBillingCheckoutUrl={props.getBillingCheckoutUrl}
        />
      </SheetContent>
    </Sheet>
  );
}
