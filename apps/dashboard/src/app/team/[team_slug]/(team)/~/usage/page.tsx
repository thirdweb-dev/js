import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import type {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { format } from "date-fns/format";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PLANS } from "utils/pricing";
import { getAccount } from "../../../../../account/settings/getAccount";
import { getAccountUsage } from "./getAccountUsage";
import { Usage } from "./overview/components/Usage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const account = await getAccount();

  if (!account) {
    return redirect(
      `/login?next=${encodeURIComponent(`/team/${params.team_slug}/~/usage`)}`,
    );
  }

  const accountUsage = await getAccountUsage();
  if (!accountUsage) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex grow flex-col gap-10">
      <PlanInfoCard
        account={account}
        accountUsage={accountUsage}
        team_slug={params.team_slug}
      />
      <Usage usage={accountUsage} />
    </div>
  );
}

function PlanInfoCard(props: {
  account: Account;
  accountUsage: UsageBillableByService;
  team_slug: string;
}) {
  const { account, accountUsage } = props;

  return (
    <div className="rounded-lg border bg-muted/50">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <h3 className="font-semibold text-2xl tracking-tight">
          {PLANS[account.plan as keyof typeof PLANS].title} Plan
        </h3>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/team/${props.team_slug}/~/settings/billing`}>
              Manage Billing
            </Link>
          </Button>

          <Button asChild variant="outline" className="gap-2">
            <TrackedLinkTW
              href="/pricing"
              category="billingAccount"
              label="learn-more-pricing"
              target="_blank"
            >
              View all plans
            </TrackedLinkTW>
          </Button>
        </div>
      </div>

      <Separator />

      <div className="p-6 lg:p-6">
        <BillingInfo account={account} usage={accountUsage} />
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
