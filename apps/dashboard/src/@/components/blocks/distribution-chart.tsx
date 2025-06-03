import { cn } from "@/lib/utils";

export type Segment = {
  label: string;
  percent: number;
  color: string;
};

type DistributionBarChartProps = {
  segments: Segment[];
  title: string;
};

export function DistributionBarChart(props: DistributionBarChartProps) {
  const totalPercentage = props.segments.reduce(
    (sum, segment) => sum + segment.percent,
    0,
  );

  const invalidTotalPercentage = totalPercentage !== 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-medium text-sm">{props.title}</h3>
        <div
          className={cn(
            "font-medium text-muted-foreground text-sm",
            invalidTotalPercentage && "text-red-500",
          )}
        >
          Total: {totalPercentage}%
        </div>
      </div>

      {/* Bar */}
      <div className="flex h-3 overflow-hidden rounded-lg">
        {props.segments.map((segment) => {
          return (
            <div
              key={segment.label}
              className="flex h-full items-center justify-center transition-all duration-200"
              style={{
                width: `${segment.percent}%`,
                backgroundColor: segment.color,
              }}
            />
          );
        })}
      </div>

      {/* Legends */}
      <div className="mt-3 flex flex-col gap-1 lg:flex-row lg:gap-6">
        {props.segments.map((segment) => {
          return (
            <div key={segment.label} className="flex items-center gap-1.5">
              <div
                className="size-3 rounded-full"
                style={{
                  backgroundColor: segment.color,
                }}
              />
              <p
                className={cn(
                  "text-sm",
                  (segment.percent > 100 || segment.percent < 0) &&
                    "text-destructive-text",
                )}
              >
                {segment.label}: {segment.percent}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
