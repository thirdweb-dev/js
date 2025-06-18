import { Button } from "@/components/ui/button";
import { normalizeTimeISOString } from "@/lib/time";
import { FileCode2Icon, MessageSquareQuoteIcon } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { fetchNebulaAnalytics } from "./fetch-nebula-analytics";
import { NebulaAnalyticsFilter } from "./nebula-analytics-filter";
import { NebulaAnalyticsDashboardUI } from "./nebula-analytics-ui";
import { getNebulaAnalyticsRangeFromSearchParams } from "./utils";

export function NebulaAnalyticsPage(props: {
  searchParams: {
    from: string | undefined | string[];
    to: string | undefined | string[];
    interval: string | undefined | string[];
  };
  teamId: string;
  authToken: string;
  projectId: string;
}) {
  return (
    <ResponsiveSearchParamsProvider value={props.searchParams}>
      <header className="border-b">
        <div className="container flex max-w-7xl flex-col items-start gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <h1 className="font-semibold text-3xl tracking-tight">Nebula</h1>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-card" asChild>
              <Link
                href="https://nebula.thirdweb.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquareQuoteIcon className="size-4 text-muted-foreground" />
                Playground
              </Link>
            </Button>

            <Button variant="outline" className="gap-2 bg-card" asChild>
              <Link
                href="https://portal.thirdweb.com/nebula"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileCode2Icon className="size-4 text-muted-foreground" />
                API Reference
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl pt-8">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <h2 className="font-semibold text-2xl tracking-tight">Analytics</h2>
          <NebulaAnalyticsFilter />
        </div>
        <ResponsiveSuspense
          searchParamsUsed={["from", "to", "interval"]}
          fallback={<NebulaAnalyticsDashboardUI data={[]} isPending={true} />}
        >
          <NebulaAnalyticDashboard
            searchParams={props.searchParams}
            teamId={props.teamId}
            projectId={props.projectId}
            authToken={props.authToken}
          />
        </ResponsiveSuspense>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}

async function NebulaAnalyticDashboard(props: {
  teamId: string;
  authToken: string;
  projectId: string;
  searchParams: {
    from: string | undefined | string[];
    to: string | undefined | string[];
    interval: string | undefined | string[];
  };
}) {
  const { range, interval } = getNebulaAnalyticsRangeFromSearchParams(
    props.searchParams,
  );

  const res = await fetchNebulaAnalytics({
    teamId: props.teamId,
    authToken: props.authToken,
    projectId: props.projectId,
    from: normalizeTimeISOString(range.from),
    to: normalizeTimeISOString(range.to),
    // internally renamed
    period: interval,
  });

  if (!res.ok) {
    return (
      <div className="flex min-h-[300px] grow items-center justify-center rounded-lg border">
        <div>
          <p className="mb-2 text-center text-destructive-text">
            Failed to fetch Nebula analytics
          </p>
          <p className="text-muted-foreground">{res.error}</p>
        </div>
      </div>
    );
  }

  return <NebulaAnalyticsDashboardUI data={res.data} isPending={false} />;
}
