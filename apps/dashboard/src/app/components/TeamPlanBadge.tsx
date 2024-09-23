import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TeamPlanBadge(props: {
  plan: "free" | "growth" | "pro";
  className?: string;
}) {
  return (
    <Badge
      variant={
        props.plan === "free"
          ? "secondary"
          : props.plan === "growth"
            ? "success"
            : "default"
      }
      className={cn("px-1.5 capitalize", props.className)}
    >
      {props.plan}
    </Badge>
  );
}
