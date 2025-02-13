import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import { normalizeTimeISOString } from "../../../../../../../lib/time";
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
  accountId: string;
  authToken: string;
}) {
  return (
    <ResponsiveSearchParamsProvider value={props.searchParams}>
      <header className="border-b">
        <div className="container flex flex-col items-start gap-3 py-10 md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
              Nebula
            </h1>
          </div>
          <NebulaAnalyticsFilter />
        </div>
      </header>

      <div className="container pt-8 pb-20">
        <ResponsiveSuspense
          searchParamsUsed={["from", "to", "interval"]}
          fallback={<NebulaAnalyticsDashboardUI data={[]} isPending={true} />}
        >
          <NebulaAnalyticDashboard
            searchParams={props.searchParams}
            accountId={props.accountId}
            authToken={props.authToken}
          />
        </ResponsiveSuspense>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}

async function NebulaAnalyticDashboard(props: {
  accountId: string;
  authToken: string;
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
    accountId: props.accountId,
    authToken: props.authToken,
    from: normalizeTimeISOString(range.from),
    to: normalizeTimeISOString(range.to),
    interval,
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
