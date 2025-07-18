import { cn } from "@/lib/utils";

export type Segment = {
  label: string;
  percent: number;
  value: string;
  color: string;
};

type DistributionBarChartProps = {
  segments: Segment[];
  title?: string;
  titleClassName?: string;
  barClassName?: string;
};

export function DistributionBarChart(props: DistributionBarChartProps) {
  const totalPercentage = props.segments.reduce(
    (sum, segment) => sum + segment.percent,
    0,
  );

  const invalidTotalPercentage = totalPercentage !== 100;

  return (
    <div>
      {props.title && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className={cn("font-medium text-sm", props.titleClassName)}>
            {props.title}
          </h3>
          <div
            className={cn(
              "font-medium text-muted-foreground text-sm",
              invalidTotalPercentage && "text-red-500",
            )}
          >
            Total: {totalPercentage}%
          </div>
        </div>
      )}

      {/* Bar */}
      <div
        className={cn(
          "flex h-3 overflow-hidden rounded-lg",
          props.barClassName,
        )}
      >
        {props.segments.map((segment) => {
          return (
            <div
              className={cn(
                "flex h-full items-center justify-center transition-all duration-200",
                segment.percent > 0 && "border-r-2 border-background",
              )}
              key={segment.label}
              style={{
                backgroundColor: segment.color,
                width: `${segment.percent}%`,
              }}
            />
          );
        })}
      </div>

      {/* Legends */}
      <div className="mt-3 flex flex-col gap-1 lg:flex-row lg:gap-6">
        {props.segments.map((segment) => {
          return (
            <div className="flex items-center gap-1.5" key={segment.label}>
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
                {segment.label}: {segment.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
