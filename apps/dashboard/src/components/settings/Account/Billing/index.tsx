import { getBillingCheckoutUrl, getBillingPortalUrl } from "@/actions/billing";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { PlanInfoCard } from "../../../../app/team/[team_slug]/(team)/~/settings/billing/components/PlanInfoCard";
import { CreditsInfoCard } from "./PlanCard";
import { BillingPricing } from "./Pricing";
import { Coupons } from "./SubscriptionCoupons/Coupons";

// TODO - move this in app router folder in other pr

interface BillingProps {
  team: Team;
  subscriptions: TeamSubscription[];
  twAccount: Account;
}

export const Billing: React.FC<BillingProps> = ({
  team,
  subscriptions,
  twAccount,
}) => {
  const validPayment =
    team.billingStatus === "validPayment" || team.billingStatus === "pastDue";

  const planSubscription = subscriptions.find((sub) => sub.type === "PLAN");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <PlanInfoCard
          team={team}
          subscriptions={subscriptions}
          getBillingPortalUrl={getBillingPortalUrl}
        />

        <div className="h-5" />

        <Alert variant="info">
          <AlertCircleIcon className="size-5" />
          <AlertTitle>Manage your plan</AlertTitle>
          <AlertDescription className="leading-relaxed">
            <span>
              Adjust your plan here to avoid unnecessary charges. For details,
              see{" "}
            </span>
            <span>
              <Link
                href="https://portal.thirdweb.com/account/billing/manage-billing"
                target="_blank"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {" "}
                how to manage billing
              </Link>{" "}
            </span>
          </AlertDescription>
        </Alert>
      </div>

      <BillingPricing
        team={team}
        trialPeriodEndedAt={planSubscription?.trialEnd ?? undefined}
        getBillingCheckoutUrl={getBillingCheckoutUrl}
      />

      <CreditsInfoCard twAccount={twAccount} />
      <Coupons teamId={team.id} isPaymentSetup={validPayment} />
    </div>
  );
};
