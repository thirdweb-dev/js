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
    <div className="p-4 bg-background border border-border rounded-lg min-h-[140px] flex flex-col">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-medium">{name}</h3>
        {tooltip && (
          <ToolTipLabel label={tooltip}>
            <CircleHelpIcon className="text-muted-foreground size-4" />
          </ToolTipLabel>
        )}
      </div>

      <div className="h-6" />

      <div className="flex flex-col gap-2 mt-auto">
        {title && <p className="mb-2 text-foreground font-semibold">{title}</p>}

        {total !== undefined && (
          <p className="text-muted-foreground text-sm">
            {typeof total === "number" ? toUSD(total) : total}
          </p>
        )}

        {progress !== undefined && <Progress value={progress} />}

        {overage && (
          <p className="text-muted-foreground mt-2 text-sm">
            Additional overage fees to your next invoice will be{" "}
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
    <div className="bg-muted rounded-full">
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
