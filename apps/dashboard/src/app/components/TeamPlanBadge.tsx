import type { Team } from "@/api/team";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TeamPlanBadge(props: {
  plan: Team["billingPlan"];
  className?: string;
}) {
  return (
    <Badge
      variant={
        props.plan === "free" || props.plan === "starter"
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
