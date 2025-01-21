import type { JSX } from "react";
import { toUSD } from "utils/number";

interface UsageCardProps {
  name: string;
  overage?: number;
  title?: string;
  total?: string | number | JSX.Element;
  progress?: number;
  description: string;
  children?: JSX.Element;
  totalUsage?: string;
}

export const UsageCard: React.FC<UsageCardProps> = ({
  name,
  title,
  total,
  overage,
  progress,
  description,
  children,
  totalUsage,
}) => {
  return (
    <div className="relative flex min-h-[190px] flex-col rounded-lg border border-border bg-card p-4 lg:p-6">
      <h3 className="mb-1 font-semibold text-xl tracking-tight">{name}</h3>
      <p className="text-muted-foreground"> {description}</p>

      <div className="h-6" />

      <div className="mt-auto flex flex-col gap-1.5">
        {title && <p className="text-foreground">{title}</p>}

        {total !== undefined && (
          <p className="text-muted-foreground">
            {typeof total === "number" ? toUSD(total) : total}
          </p>
        )}

        {progress !== undefined && <Progress value={progress} />}
        {totalUsage && <p className="mt-2 text-foreground">{totalUsage}</p>}

        {overage && (
          <p className="mt-2 text-muted-foreground text-sm">
            Additional overage fees to your next invoice will be
            <span className="text-foreground">{toUSD(overage)}</span>
          </p>
        )}
      </div>

      {children}
    </div>
  );
};

function Progress(props: {
  value: number;
}) {
  return (
    <div className="rounded-full bg-muted">
      <div
        className={"h-2 rounded-full bg-blue-600"}
        style={{
          width: `${Math.min(props.value, 100)}%`,
        }}
      />
    </div>
  );
}
