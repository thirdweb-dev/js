import { getFiltersFromSearchParams } from "@/lib/time";

export function getTxAnalyticsFiltersFromSearchParams(params: {
  from?: string | undefined | string[];
  to?: string | undefined | string[];
  interval?: string | undefined | string[];
}) {
  return getFiltersFromSearchParams({
    defaultRange: "last-30",
    from: params.from,
    interval: params.interval,
    to: params.to,
  });
}
