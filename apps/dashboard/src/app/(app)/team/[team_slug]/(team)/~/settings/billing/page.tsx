import { getStripeBalance } from "@/actions/stripe-actions";
import { type Team, getTeamBySlug } from "@/api/team";
import { getTeamSubscriptions } from "@/api/team-subscription";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { redirect } from "next/navigation";
import { CreditsInfoCard } from "../../../../../../../../components/settings/Account/Billing/PlanCard";
import { Coupons } from "../../../../../../../../components/settings/Account/Billing/SubscriptionCoupons/Coupons";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { PlanInfoCardClient } from "./components/PlanInfoCard.client";
import CreditTopupSection from "./components/top-up-section.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
  searchParams: Promise<{
    showPlans?: string | string[];
    highlight?: string | string[];
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const pagePath = `/team/${params.team_slug}/settings/billing`;

  const [account, team, authToken] = await Promise.all([
    getValidAccount(pagePath),
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team) {
    redirect("/team");
  }

  const [subscriptions, stripeBalance] = await Promise.all([
    getTeamSubscriptions(team.slug),
    team.stripeCustomerId ? getStripeBalance(team.stripeCustomerId) : 0,
  ]);

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  if (!subscriptions) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  const highlightPlan =
    typeof searchParams.highlight === "string"
      ? (searchParams.highlight as Team["billingPlan"])
      : undefined;

  const openPlanSheetButtonByDefault = searchParams.showPlans === "true";

  const validPayment =
    team.billingStatus === "validPayment" || team.billingStatus === "pastDue";

  return (
    <div className="flex flex-col gap-12">
      <div>
        <PlanInfoCardClient
          team={team}
          subscriptions={subscriptions}
          openPlanSheetButtonByDefault={openPlanSheetButtonByDefault}
          highlightPlan={highlightPlan}
        />
      </div>

      <CreditTopupSection
        // stripe treats the balance as negative when it is due to the customer (to the customer this is a "positive" balance)
        // we also need to divide by 100 to get the balance in USD (it is returned in USD cents)
        currentBalance={stripeBalance === 0 ? 0 : stripeBalance / -100}
        teamSlug={team.slug}
      />

      <CreditsInfoCard
        twAccount={account}
        client={client}
        teamSlug={team.slug}
      />
      <Coupons teamId={team.id} isPaymentSetup={validPayment} />
    </div>
  );
}
