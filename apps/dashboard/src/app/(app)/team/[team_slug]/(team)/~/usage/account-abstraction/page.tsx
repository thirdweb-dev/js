import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProjects } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { getTeamSubscriptions } from "@/api/team-subscription";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { SponsoredTransactionsTable } from "../overview/components/SponsoredTransactionsTable";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const [team, authToken] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/usage/account-abstraction`);
  }

  if (!team) {
    redirect("/team");
  }

  const [subscriptions, projects] = await Promise.all([
    getTeamSubscriptions(team.slug),
    getProjects(team.slug),
  ]);

  const usageSubscription = subscriptions?.find(
    (subscription) => subscription.type === "USAGE",
  );

  if (!usageSubscription) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        You are on a free plan. Please upgrade to a paid plan to view your
        usage.
      </div>
    );
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex flex-col gap-14">
      <SponsoredTransactionsTable
        client={client}
        from={usageSubscription.currentPeriodStart}
        projects={projects}
        teamId={team.id}
        teamSlug={team.slug}
        to={usageSubscription.currentPeriodEnd}
        variant="team"
      />
    </div>
  );
}
