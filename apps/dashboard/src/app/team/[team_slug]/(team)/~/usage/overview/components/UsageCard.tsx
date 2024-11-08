import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleHelpIcon } from "lucide-react";
import type { JSX } from "react";
import { toUSD } from "utils/number";

interface UsageCardProps {
  name: string;
  overage?: number;
  title?: string;
  total?: string | number | JSX.Element;
  progress?: number;
  tooltip?: string;
}

export const UsageCard: React.FC<UsageCardProps> = ({
  name,
  title,
  total,
  overage,
  progress,
  tooltip,
}) => {
  return (
    <div className="relative flex min-h-[150px] flex-col rounded-lg border border-border bg-muted/50 p-4">
      <h3 className="pr-10 font-medium text-lg">{name}</h3>
      {tooltip && (
        <ToolTipLabel label={tooltip}>
          <CircleHelpIcon className="absolute top-4 right-4 size-5 text-muted-foreground hover:text-foreground" />
        </ToolTipLabel>
      )}

      <div className="h-6" />

      <div className="mt-auto flex flex-col gap-1.5">
        {title && <p className="text-foreground text-sm">{title}</p>}

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
