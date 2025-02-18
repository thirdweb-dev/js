import { getNebulaFiltersFromSearchParams } from "../../../../../../../lib/time";

export function getNebulaAnalyticsRangeFromSearchParams(searchParams: {
  from: string | undefined | string[];
  to: string | undefined | string[];
  interval: string | undefined | string[];
}) {
  return getNebulaFiltersFromSearchParams({
    from: searchParams.from,
    to: searchParams.to,
    interval: searchParams.interval,
  });
}
