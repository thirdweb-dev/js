import { getUserOpUsage } from "@/api/analytics";
import { getProject } from "@/api/projects";
import {
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { AccountAbstractionAnalytics } from "components/smart-wallets/AccountAbstractionAnalytics";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { searchParamLoader } from "./search-params";

interface PageParams {
  team_slug: string;
  project_slug: string;
}

export default async function Page(props: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
  children: React.ReactNode;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    searchParamLoader(props.searchParams),
  ]);

  const project = await getProject(params.team_slug, params.project_slug);

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

  const userOpStats = await getUserOpUsage({
    teamId: project.teamId,
    projectId: project.id,
    from: range.from,
    to: range.to,
    period: interval,
  });

  return <AccountAbstractionAnalytics userOpStats={userOpStats} />;
}
