import { redirectToBillingPortal, redirectToCheckout } from "@/actions/billing";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { PlanInfoCard } from "../../../../app/team/[team_slug]/(team)/~/settings/billing/components/PlanInfoCard";
import { getValidTeamPlan } from "../../../../app/team/components/TeamHeader/getValidTeamPlan";
import { CouponSection } from "./CouponCard";
import { CreditsInfoCard } from "./PlanCard";
import { BillingPricing } from "./Pricing";

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
  const validPayment = team.billingStatus === "validPayment";
  const validPlan = getValidTeamPlan(team);

  const planSubscription = subscriptions.find((sub) => sub.type === "PLAN");

  return (
    <div className="flex flex-col gap-12">
      <PlanInfoCard
        team={team}
        subscriptions={subscriptions}
        redirectToBillingPortal={redirectToBillingPortal}
      />

      <div>
        <h2 className="font-semibold text-2xl tracking-tight">
          {validPlan === "free" ? "Select a Plan" : "Plans"}
        </h2>
        <div className="h-3" />
        <BillingPricing
          team={team}
          trialPeriodEndedAt={planSubscription?.trialEnd ?? undefined}
          redirectToCheckout={redirectToCheckout}
        />
      </div>

      <CreditsInfoCard twAccount={twAccount} />
      <CouponSection teamId={team.id} isPaymentSetup={validPayment} />
    </div>
  );
};
