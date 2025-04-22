import { Badge } from "@/components/ui/badge";

export function Stat({
  label,
  value,
  trend,
}: { label: string; value: string | number; trend?: number }) {
  return (
    <div className="flex flex-col gap-1 p-4 text-left">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-2xl text-foreground leading-none">
          {value.toLocaleString()}
        </span>
        {trend && (
          // trend is rounded to 1 decimal place max
          <Badge
            className="flex-shrink-0 px-2.5 py-1 text-xs leading-[0.9]"
            variant={trend > 0 ? "success" : "destructive"}
          >
            {trend > 0 ? "+" : "-"}
            {Number(Math.abs(trend * 100).toFixed(1)).toLocaleString()}%
          </Badge>
        )}
      </div>
    </div>
  );
}
