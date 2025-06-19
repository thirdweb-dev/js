import { getFiltersFromSearchParams } from "@/lib/time";
import type { DurationId } from "../components/analytics/date-range-selector";

export function getUniversalBridgeFiltersFromSearchParams(params: {
  from: string | undefined | string[];
  to: string | undefined | string[];
  interval: string | undefined | string[];
  defaultRange: DurationId;
}) {
  return getFiltersFromSearchParams({
    from: params.from,
    to: params.to,
    interval: params.interval,
    defaultRange: params.defaultRange,
  });
}
