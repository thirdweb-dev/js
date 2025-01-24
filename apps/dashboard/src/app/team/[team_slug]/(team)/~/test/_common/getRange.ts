import { getLastNDaysRange } from "../../../../../../../components/analytics/date-range-selector";
import type { Range } from "../../../../../../../components/analytics/date-range-selector";
import { ignoreTime } from "./date";

export function getRange(params: {
  from: string | undefined;
  to: string | undefined;
}) {
  const fromStr = params.from;
  const toStr = params.to;

  const defaultRange = getLastNDaysRange("last-30");
  const range: Range =
    fromStr && toStr && typeof fromStr === "string" && typeof toStr === "string"
      ? {
          from: ignoreTime(new Date(fromStr)),
          to: ignoreTime(new Date(toStr)),
          type: "custom",
        }
      : {
          from: ignoreTime(defaultRange.from),
          to: ignoreTime(defaultRange.to),
          type: defaultRange.type,
        };

  return range;
}
