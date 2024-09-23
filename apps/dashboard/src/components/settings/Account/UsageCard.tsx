import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleHelpIcon } from "lucide-react";
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
    <div className="flex min-h-[140px] flex-col rounded-lg border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-base">{name}</h3>
        {tooltip && (
          <ToolTipLabel label={tooltip}>
            <CircleHelpIcon className="size-4 text-muted-foreground" />
          </ToolTipLabel>
        )}
      </div>

      <div className="h-6" />

      <div className="mt-auto flex flex-col gap-2">
        {title && <p className="mb-2 font-semibold text-foreground">{title}</p>}

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
