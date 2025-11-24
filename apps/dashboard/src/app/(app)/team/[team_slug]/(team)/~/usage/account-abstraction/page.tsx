import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getUserOpUsage } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProjects } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import { getTeamSubscriptions } from "@/api/team/team-subscription";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { AccountAbstractionSummary } from "../../../../[project_slug]/(sidebar)/account-abstraction/AccountAbstractionAnalytics/AccountAbstractionSummary";
import { AccountAbstractionAnalytics } from "../../../../[project_slug]/(sidebar)/account-abstraction/aa-analytics";
import { searchParamLoader } from "../../../../[project_slug]/(sidebar)/account-abstraction/search-params";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
  searchParams: Promise<SearchParams>;
}) {
  const [params, parsedSearchParams, authToken] = await Promise.all([
    props.params,
    searchParamLoader(props.searchParams),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/usage/account-abstraction`);
  }

  const team = await getTeamBySlug(params.team_slug);

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

  const interval = parsedSearchParams.interval ?? "week";
  const rangeType = parsedSearchParams.range || "last-120";

  const range: Range = {
    from:
      rangeType === "custom"
        ? parsedSearchParams.from
        : getLastNDaysRange(rangeType).from,
    to:
      rangeType === "custom"
        ? parsedSearchParams.to
        : getLastNDaysRange(rangeType).to,
    type: rangeType,
  };

  const userOpStats = await getUserOpUsage(
    {
      from: range.from,
      period: interval,
      teamId: team.id,
      to: range.to,
    },
    authToken,
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return (
    <div className="flex flex-col gap-10">
      <AccountAbstractionSummary
        authToken={authToken}
        teamId={team.id}
        from={range.from}
        to={range.to}
      />

      <AccountAbstractionAnalytics
        client={client}
        projects={projects}
        teamId={team.id}
        teamSlug={team.slug}
        userOpStats={userOpStats}
        variant="team"
      />
    </div>
  );
}
