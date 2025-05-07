import { getFiltersFromSearchParams } from "@/lib/time";

export function getNebulaFiltersFromSearchParams(params: {
  from: string | undefined | string[];
  to: string | undefined | string[];
  interval: string | undefined | string[];
}) {
  return getFiltersFromSearchParams({
    from: params.from,
    to: params.to,
    interval: params.interval,
    defaultRange: "last-30",
  });
}
