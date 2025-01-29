import type { Range } from "components/analytics/date-range-selector";
import { InAppWalletAnalytics } from "components/embedded-wallets/Analytics";
import { notFound } from "next/navigation";
import { getProject } from "../../../../../../@/api/projects";
import { getAPIKeyForProjectId } from "../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
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
    notFound();
  }

  const apiKey = await getAPIKeyForProjectId(project.id);
  if (!apiKey) {
    notFound();
  }

  return (
    <InAppWalletAnalytics
      clientId={apiKey.key}
      interval={interval}
      range={range as Range}
    />
  );
}
