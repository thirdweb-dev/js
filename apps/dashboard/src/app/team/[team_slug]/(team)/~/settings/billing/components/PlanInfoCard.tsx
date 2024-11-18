import type { Team } from "@/api/team";
import {
  type TeamSubscription,
  parseThirdwebSKU,
} from "@/api/team-subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { differenceInDays, isAfter } from "date-fns";
import { format } from "date-fns/format";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { getValidTeamPlan } from "../../../../../../components/TeamHeader/getValidTeamPlan";

export function PlanInfoCard(props: {
  subscriptions: TeamSubscription[];
  team: Team;
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
    <div className="rounded-lg border border-border bg-muted/50">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-2xl capitalize tracking-tight">
              {validPlan} Plan
            </h3>
            {trialEndsInFuture && <Badge>Trial</Badge>}
          </div>
          {trialEndsAfterDays > 0 && (
            <p className="text-muted-foreground text-sm">
              Your trial ends in {trialEndsAfterDays} days
            </p>
          )}
        </div>
        <div>
          <Button asChild variant="outline">
            <Link href={`/team/${team.slug}/billing/manage`}>
              Manage Billing
            </Link>
          </Button>
        </div>

        {isActualFreePlan && (
          <div>
            {/* manage team billing */}
            <Button asChild variant="outline">
              <Link href={`/team/${team.slug}/billing/manage`}>
                Manage Billing
              </Link>
            </Button>

            <Button asChild variant="outline">
              <TrackedLinkTW
                category="account"
                href="/pricing"
                label="pricing-plans"
                target="_blank"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                View Pricing
              </TrackedLinkTW>
            </Button>
          </div>
        )}
      </div>

      <Separator />

      <div className="p-4 lg:p-6">
        {isActualFreePlan ? (
          <div className="flex flex-col items-center py-8 text-center max-sm:gap-4">
            <CircleAlertIcon className="mb-3 text-muted-foreground lg:size-6" />
            <p>Your plan includes a fixed amount of free usage</p>
            <p>
              To unlock additional usage, Upgrade your plan to Starer or Growth
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

  // only plan and usage subscriptions are considered for now
  const totalUsd = getAllSubscriptionsTotal(
    subscriptions.filter((sub) => sub.type === "PLAN" || sub.type === "USAGE"),
  );

  return (
    <div>
      {planSubscription && (
        <SubscriptionOverview
          subscription={planSubscription}
          title="Monthly Plan Cost"
        />
      )}

      <Separator className="my-4" />

      {usageSubscription && (
        <SubscriptionOverview
          subscription={usageSubscription}
          title="On-Demand Charges"
        />
      )}

      <Separator className="my-4" />

      <div className="flex items-center justify-between gap-6">
        <h5 className="font-medium text-lg">Total Upcoming Bill</h5>
        <p className="text-foreground">{totalUsd}</p>
      </div>
    </div>
  );
}

function SubscriptionOverview(props: {
  subscription: TeamSubscription;
  title: string;
}) {
  const { subscription } = props;
  const lines = subscription.upcomingInvoice.lines.filter((x) => x.amount > 0);
  const showBreakDown = lines.length > 0 && subscription.type !== "PLAN";
  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <div>
          <h5 className="font-medium text-lg">{props.title} </h5>
          <p className="text-muted-foreground text-sm lg:text-base">
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

        {!showBreakDown && (
          <p className="text-muted-foreground">
            {formatCurrencyAmount(
              subscription.upcomingInvoice.amount || 0,
              subscription.upcomingInvoice.currency,
            )}
          </p>
        )}
      </div>

      {showBreakDown && (
        <div className="mt-3">
          <div className="flex flex-col gap-4">
            {lines.map((line) => (
              <div
                key={line.thirdwebSku}
                className="flex items-center justify-between gap-5"
              >
                <div>
                  <h4> {parseThirdwebSKU(line.thirdwebSku)}</h4>
                  <p className="text-muted-foreground text-sm lg:text-base">
                    {line.description}
                  </p>
                </div>
                <p className="text-muted-foreground">
                  {formatCurrencyAmount(
                    line.amount,
                    subscription.upcomingInvoice.currency,
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getAllSubscriptionsTotal(subscriptions: TeamSubscription[]) {
  let totalCents = 0;
  let currency = "USD";

  for (const subscription of subscriptions) {
    const amount = subscription.upcomingInvoice.amount;
    currency = subscription.upcomingInvoice.currency;
    if (amount) {
      totalCents += amount;
    }
  }

  return formatCurrencyAmount(totalCents, currency);
}

function formatCurrencyAmount(centsAmount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
  }).format(centsAmount / 100);
}
