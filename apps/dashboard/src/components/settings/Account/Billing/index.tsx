"use client";
import type { Team } from "@/api/team";
import type {
  Account,
  UsageBillableByService,
} from "@3rdweb-sdk/react/hooks/useApi";
import { PlanInfoCard } from "../../../../app/team/[team_slug]/(team)/~/settings/billing/components/PlanInfoCard";
import { getValidTeamPlan } from "../../../../app/team/components/TeamHeader/getValidTeamPlan";
import { CouponSection } from "./CouponCard";
import { CreditsInfoCard } from "./PlanCard";
import { BillingPricing } from "./Pricing";

// TODO - move this in app router folder in other pr

interface BillingProps {
  account: Account;
  team: Team;
  accountUsage: UsageBillableByService;
}

export const Billing: React.FC<BillingProps> = ({
  account,
  team,
  accountUsage,
}) => {
  const validPayment = team.billingStatus === "validPayment";
  const validPlan = getValidTeamPlan(team);

  return (
    <div className="flex flex-col gap-12">
      <PlanInfoCard account={account} accountUsage={accountUsage} team={team} />

      <div>
        <h2 className="font-semibold text-2xl tracking-tight">
          {validPlan === "free" ? "Select a Plan" : "Plans"}
        </h2>
        <div className="h-3" />
        <BillingPricing
          team={team}
          trialPeriodEndedAt={account.trialPeriodEndedAt}
          canTrialGrowth={!account.trialPeriodEndedAt}
        />
      </div>

      <CreditsInfoCard />
      <CouponSection teamId={team.id} isPaymentSetup={validPayment} />
    </div>
  );
};
