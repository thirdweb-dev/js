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
import { CreditBalanceSection } from "./components/credit-balance-section.client";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
  searchParams: Promise<{
    showPlans?: string | string[];
    highlight?: string | string[];
  }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const pagePath = `/team/${params.team_slug}/settings/billing`;

  const [account, team, authToken] = await Promise.all([
    getValidAccount(pagePath),
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!team) {
    redirect("/team");
  }

  const subscriptions = await getTeamSubscriptions(team.slug);

  if (!subscriptions) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  const highlightPlan =
    typeof searchParams.highlight === "string"
      ? (searchParams.highlight as Team["billingPlan"])
      : undefined;

  const validPayment =
    team.billingStatus === "validPayment" || team.billingStatus === "pastDue";

  return (
    <div className="flex flex-col gap-12">
      <div>
        <PlanInfoCardClient
          team={team}
          subscriptions={subscriptions}
          openPlanSheetButtonByDefault={searchParams.showPlans === "true"}
          highlightPlan={highlightPlan}
        />
      </div>

      {/* Credit Balance Section */}
      {team.stripeCustomerId && (
        <CreditBalanceSection
          teamSlug={team.slug}
          balancePromise={getStripeBalance(team.stripeCustomerId)}
        />
      )}

      <CreditsInfoCard
        twAccount={account}
        client={client}
        teamSlug={team.slug}
      />
      <Coupons teamId={team.id} isPaymentSetup={validPayment} />
    </div>
  );
}
