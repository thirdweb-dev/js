import type { Range } from "components/analytics/date-range-selector";
import { InAppWalletAnalytics } from "components/embedded-wallets/Analytics";
import { redirect } from "next/navigation";
import { getProject } from "../../../../../../@/api/projects";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
  }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const range =
    searchParams.from && searchParams.to
      ? {
          type: searchParams.type ?? "last-120",
          from: new Date(searchParams.from),
          to: new Date(searchParams.to),
        }
      : undefined;

  const interval: "day" | "week" = ["day", "week"].includes(
    searchParams.interval ?? "",
  )
    ? (searchParams.interval as "day" | "week")
    : "week";

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  return (
    <InAppWalletAnalytics
      teamId={project.teamId}
      projectId={project.id}
      interval={interval}
      range={range as Range}
    />
  );
}
