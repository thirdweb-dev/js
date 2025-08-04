import { redirect } from "next/navigation";
import { getStripeBalance } from "@/actions/stripe-actions";
import { getValidAccount } from "@/api/account/get-account";
import { getTeamBySlug, type Team } from "@/api/team/get-team";
import { getMemberByAccountId } from "@/api/team/team-members";
import { getTeamSubscriptions } from "@/api/team/team-subscription";
import { Coupons } from "./components/coupons/Coupons";
import { CreditBalanceSection } from "./components/credit-balance-section.client";
import { CreditsInfoCard } from "./components/PlanCard";
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
  const pagePath = `/team/${params.team_slug}/billing`;

  const account = await getValidAccount(pagePath);

  const [team, teamMember] = await Promise.all([
    getTeamBySlug(params.team_slug),
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

  const highlightPlan =
    typeof searchParams.highlight === "string"
      ? (searchParams.highlight as Team["billingPlan"])
      : undefined;

  const validPayment =
    team.billingStatus === "validPayment" || team.billingStatus === "pastDue";

  return (
    <div className="flex flex-col gap-8">
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

      <CreditsInfoCard />
      <Coupons isPaymentSetup={validPayment} teamId={team.id} />
    </div>
  );
}
