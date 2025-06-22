import { redirect } from "next/navigation";
import { getStripeBalance } from "@/actions/stripe-actions";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug, type Team } from "@/api/team";
import { getMemberByAccountId } from "@/api/team-members";
import { getTeamSubscriptions } from "@/api/team-subscription";
import { CreditsInfoCard } from "@/components/billing/PlanCard";
import { Coupons } from "@/components/billing/SubscriptionCoupons/Coupons";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { CreditBalanceSection } from "./components/credit-balance-section.client";
import { PlanInfoCardClient } from "./components/PlanInfoCard.client";

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

  const account = await getValidAccount(pagePath);

  const [team, authToken, teamMember] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
    getMemberByAccountId(params.team_slug, account.id),
  ]);

  if (!team || !teamMember) {
    redirect("/team");
  }

  const isOwnerAccount = teamMember.role === "OWNER";

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
          highlightPlan={highlightPlan}
          isOwnerAccount={isOwnerAccount}
          openPlanSheetButtonByDefault={searchParams.showPlans === "true"}
          subscriptions={subscriptions}
          team={team}
        />
      </div>

      {/* Credit Balance Section */}
      {team.stripeCustomerId && (
        <CreditBalanceSection
          balancePromise={getStripeBalance(team.stripeCustomerId)}
          isOwnerAccount={isOwnerAccount}
          teamSlug={team.slug}
        />
      )}

      <CreditsInfoCard
        client={client}
        teamSlug={team.slug}
        twAccount={account}
      />
      <Coupons isPaymentSetup={validPayment} teamId={team.id} />
    </div>
  );
}
