import { getFiltersFromSearchParams } from "@/lib/time";
import type { DurationId } from "../components/analytics/date-range-selector";

export function getNebulaFiltersFromSearchParams(params: {
  from: string | undefined | string[];
  to: string | undefined | string[];
  interval: string | undefined | string[];
}) {
  return getFiltersFromSearchParams({
    defaultRange: "last-30",
    from: params.from,
    interval: params.interval,
    to: params.to,
  });
}

export function getUniversalBridgeFiltersFromSearchParams(params: {
  from: string | undefined | string[];
  to: string | undefined | string[];
  interval: string | undefined | string[];
  defaultRange: DurationId;
}) {
  return getFiltersFromSearchParams({
    defaultRange: params.defaultRange,
    from: params.from,
    interval: params.interval,
    to: params.to,
  });
}
