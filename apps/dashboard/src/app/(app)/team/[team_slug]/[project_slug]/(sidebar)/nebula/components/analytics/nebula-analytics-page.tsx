import { FileCode2Icon, MessageSquareQuoteIcon } from "lucide-react";
import Link from "next/link";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { Button } from "@/components/ui/button";
import { normalizeTimeISOString } from "@/lib/time";
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
            <Button asChild className="gap-2 bg-card" variant="outline">
              <Link
                href="https://nebula.thirdweb.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageSquareQuoteIcon className="size-4 text-muted-foreground" />
                Playground
              </Link>
            </Button>

            <Button asChild className="gap-2 bg-card" variant="outline">
              <Link
                href="https://portal.thirdweb.com/nebula"
                rel="noopener noreferrer"
                target="_blank"
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
          fallback={<NebulaAnalyticsDashboardUI data={[]} isPending={true} />}
          searchParamsUsed={["from", "to", "interval"]}
        >
          <NebulaAnalyticDashboard
            authToken={props.authToken}
            projectId={props.projectId}
            searchParams={props.searchParams}
            teamId={props.teamId}
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
    authToken: props.authToken,
    from: normalizeTimeISOString(range.from),
    // internally renamed
    period: interval,
    projectId: props.projectId,
    teamId: props.teamId,
    to: normalizeTimeISOString(range.to),
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
