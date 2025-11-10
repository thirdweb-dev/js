import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { getUserOpUsage } from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getTeamBySlug } from "@/api/team/get-team";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { AccountAbstractionSummary } from "../../account-abstraction/AccountAbstractionAnalytics/AccountAbstractionSummary";
import { SmartWalletsBillingAlert } from "../../account-abstraction/Alerts";
import { AccountAbstractionAnalytics } from "../../account-abstraction/aa-analytics";
import { searchParamLoader } from "../../account-abstraction/search-params";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [params, searchParams, authToken] = await Promise.all([
    props.params,
    searchParamLoader(props.searchParams),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/wallets/sponsored-gas`,
    );
  }

  const [team, project] = await Promise.all([
    getTeamBySlug(params.team_slug),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const interval = searchParams.interval ?? "week";
  const rangeType = searchParams.range || "last-120";

  const range: Range = {
    from:
      rangeType === "custom"
        ? searchParams.from
        : getLastNDaysRange(rangeType).from,
    to:
      rangeType === "custom"
        ? searchParams.to
        : getLastNDaysRange(rangeType).to,
    type: rangeType,
  };

  const userOpStats = await getUserOpUsage(
    {
      from: range.from,
      period: interval,
      projectId: project.id,
      teamId: project.teamId,
      to: range.to,
    },
    authToken,
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  const isBundlerServiceEnabled = !!project.services.find(
    (s) => s.name === "bundler",
  );

  const hasSmartWalletsWithoutBilling =
    isBundlerServiceEnabled &&
    team.billingStatus !== "validPayment" &&
    team.billingStatus !== "pastDue";

  return (
    <>
      {hasSmartWalletsWithoutBilling && (
        <>
          <SmartWalletsBillingAlert teamSlug={params.team_slug} />
          <div className="h-10" />
        </>
      )}
      <div className="flex grow flex-col gap-10">
        <AccountAbstractionSummary
          projectId={project.id}
          teamId={project.teamId}
          authToken={authToken}
        />

        <AccountAbstractionAnalytics
          client={client}
          projectId={project.id}
          teamId={project.teamId}
          teamSlug={params.team_slug}
          userOpStats={userOpStats}
        />
      </div>
    </>
  );
}
