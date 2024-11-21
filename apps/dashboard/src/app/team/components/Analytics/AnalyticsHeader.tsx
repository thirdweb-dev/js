import type { Range } from "components/analytics/date-range-selector";
import { RangeSelector } from "components/analytics/range-selector";

export function AnalyticsHeader(props: {
  title: string;
  interval: "day" | "week";
  range: Range;
}) {
  const { title, interval, range } = props;

  return (
    <div className="container flex flex-col items-start gap-3 py-10 md:flex-row md:items-center">
      <div className="flex-1">
        <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
          {title}
        </h1>
      </div>
      <RangeSelector interval={interval} range={range} />
    </div>
  );
}
