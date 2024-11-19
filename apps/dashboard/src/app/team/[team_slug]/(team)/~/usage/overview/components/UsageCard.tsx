import { cn } from "@/lib/utils";
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
}

export const UsageCard: React.FC<UsageCardProps> = ({
  name,
  title,
  total,
  overage,
  progress,
  description,
  children,
}) => {
  return (
    <div className="relative flex min-h-[190px] flex-col rounded-lg border border-border bg-muted/50 p-4 lg:p-6">
      <h3 className="mb-1 font-semibold text-xl">{name}</h3>
      <p className="text-muted-foreground"> {description}</p>

      <div className="h-6" />

      <div className="mt-auto flex flex-col gap-1.5">
        {title && <p className="text-foreground">{title}</p>}

        {total !== undefined && (
          <p className="text-muted-foreground text-sm">
            {typeof total === "number" ? toUSD(total) : total}
          </p>
        )}

        {progress !== undefined && <Progress value={progress} />}

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
        className={cn(
          "h-2 rounded-full",
          props.value > 90
            ? "bg-red-600"
            : props.value > 50
              ? "bg-yellow-600"
              : "bg-blue-600",
        )}
        style={{
          width: `${Math.min(props.value, 100)}%`,
        }}
      />
    </div>
  );
}
