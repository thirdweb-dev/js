import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import type {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { format } from "date-fns/format";
import { CircleAlertIcon } from "lucide-react";
import { ManageBillingButton } from "../../../../../../../../components/settings/Account/Billing/ManageButton";
import { getValidTeamPlan } from "../../../../../../components/TeamHeader/getValidTeamPlan";

export function PlanInfoCard(props: {
  account: Account;
  accountUsage: UsageBillableByService;
  team: Team;
}) {
  const { account, accountUsage, team } = props;
  const validPlan = getValidTeamPlan(team);
  const isActualFreePlan = team.billingPlan === "free";
  return (
    <div className="rounded-lg border border-border bg-muted/50">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <h3 className="font-semibold text-2xl capitalize tracking-tight">
          {validPlan} Plan
        </h3>

        {isActualFreePlan && (
          <div>
            <ManageBillingButton
              variant="outline"
              account={account}
              onlyRenderIfLink
            />

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

      <div className="p-6 lg:p-6">
        {isActualFreePlan ? (
          <div className="flex flex-col items-center py-8 text-center max-sm:gap-4">
            <CircleAlertIcon className="mb-3 text-muted-foreground lg:size-6" />
            <p>Your plan includes a fixed amount of free usage</p>
            <p>
              To unlock additional usage, Upgrade your plan to Starer or Growth
            </p>
          </div>
        ) : (
          <BillingInfo account={account} usage={accountUsage} />
        )}
      </div>
    </div>
  );
}

function BillingInfo({
  account,
  usage,
}: {
  account: Account;
  usage: UsageBillableByService;
}) {
  if (
    !account.currentBillingPeriodStartsAt ||
    !account.currentBillingPeriodEndsAt
  ) {
    return null;
  }

  const totalUsd = getBillingAmountInUSD(usage);

  return (
    <div>
      <div>
        <h5 className="font-medium">Current Billing Cycle</h5>
        <p className="text-muted-foreground">
          {format(
            new Date(account.currentBillingPeriodStartsAt),
            "MMMM dd yyyy",
          )}{" "}
          -{" "}
          {format(
            new Date(account.currentBillingPeriodEndsAt),
            "MMMM dd yyyy",
          )}{" "}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center gap-2">
        <h5 className="font-medium">Total Upcoming Bill</h5>
        <p className="text-lg text-muted-foreground">{totalUsd}</p>
      </div>
    </div>
  );
}

function getBillingAmountInUSD(usage: UsageBillableByService) {
  let total = 0;

  if (usage.billableUsd) {
    for (const amount of Object.values(usage.billableUsd)) {
      total += amount;
    }
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(total);
}
