import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebClient } from "thirdweb";
import { PlanInfoCardClient } from "../../../../app/(app)/team/[team_slug]/(team)/~/settings/billing/components/PlanInfoCard.client";
import { CreditsInfoCard } from "./PlanCard";
import { Coupons } from "./SubscriptionCoupons/Coupons";

// TODO - move this in app router folder in other pr

interface BillingProps {
  team: Team;
  subscriptions: TeamSubscription[];
  twAccount: Account;
  client: ThirdwebClient;
}

export const Billing: React.FC<BillingProps> = ({
  team,
  subscriptions,
  twAccount,
  client,
}) => {
  const validPayment =
    team.billingStatus === "validPayment" || team.billingStatus === "pastDue";

  return (
    <div className="flex flex-col gap-12">
      <div>
        <PlanInfoCardClient team={team} subscriptions={subscriptions} />
      </div>

      <CreditsInfoCard twAccount={twAccount} client={client} />
      <Coupons teamId={team.id} isPaymentSetup={validPayment} />
    </div>
  );
};
