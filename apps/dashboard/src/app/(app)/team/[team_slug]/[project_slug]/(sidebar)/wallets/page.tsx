import { redirect } from "next/navigation";
import { getProject } from "@/api/project/projects";
import type { Range } from "@/components/analytics/date-range-selector";
import { InAppWalletAnalytics } from "./analytics/chart";
import { InAppWalletsSummary } from "./analytics/chart/Summary";

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
          from: new Date(searchParams.from),
          to: new Date(searchParams.to),
          type: searchParams.type ?? "last-120",
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
    <div>
      <InAppWalletsSummary projectId={project.id} teamId={project.teamId} />
      <div className="h-10" />
      <InAppWalletAnalytics
        interval={interval}
        projectId={project.id}
        range={range as Range}
        teamId={project.teamId}
      />
    </div>
  );
}
