import type { GetBillingPortalUrlAction } from "@/actions/billing";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { BillingPortalButton } from "@/components/billing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { differenceInDays, isAfter } from "date-fns";
import { format } from "date-fns/format";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { getValidTeamPlan } from "../../../../../../components/TeamHeader/getValidTeamPlan";

export function PlanInfoCard(props: {
  subscriptions: TeamSubscription[];
  team: Team;
  getBillingPortalUrl: GetBillingPortalUrlAction;
}) {
  const { subscriptions, team } = props;
  const validPlan = getValidTeamPlan(team);
  const isActualFreePlan = team.billingPlan === "free";

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
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div>
          <div className="flex flex-col items-start gap-0.5">
            <h3 className="font-semibold text-2xl capitalize tracking-tight">
              {validPlan} Plan
            </h3>
            <p className="text-muted-foreground text-sm">
              Click on "Manage Billing" to view your invoices, update your
              payment method, or edit your billing details.
            </p>
            {trialEndsInFuture && <Badge>Trial</Badge>}
          </div>
          {trialEndsAfterDays > 0 && (
            <p className="text-muted-foreground text-sm">
              Your trial ends in {trialEndsAfterDays} days
            </p>
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          {/* go to invoices page */}

          <Button asChild variant="outline">
            <Link href={`/team/${team.slug}/~/settings/invoices`}>
              View Invoices
            </Link>
          </Button>

          {/* manage team billing */}
          <BillingPortalButton
            teamSlug={team.slug}
            buttonProps={{
              variant: "default",
              size: "sm",
            }}
            getBillingPortalUrl={props.getBillingPortalUrl}
          >
            Manage Billing
          </BillingPortalButton>
        </div>
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
          </div>
        ) : (
          <BillingInfo subscriptions={subscriptions} />
        )}
      </div>
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
