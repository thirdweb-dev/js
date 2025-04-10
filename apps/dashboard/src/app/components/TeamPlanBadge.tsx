import type { Team } from "@/api/team";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const teamPlanToBadgeVariant: Record<
  Team["billingPlan"],
  BadgeProps["variant"]
> = {
  // gray
  free: "secondary",
  starter: "secondary",
  // yellow
  starter_legacy: "warning",
  growth_legacy: "warning",
  // green
  accelerate: "success",
  growth: "success",
  scale: "success",
  // blue
  pro: "default",
};

function getTeamPlanBadgeLabel(plan: Team["billingPlan"]) {
  if (plan === "growth_legacy") {
    return "Growth - Legacy";
  }
  if (plan === "starter_legacy") {
    return "Starter - Legacy";
  }
  return plan;
}

export function TeamPlanBadge(props: {
  plan: Team["billingPlan"];
  className?: string;
}) {
  return (
    <Badge
      variant={teamPlanToBadgeVariant[props.plan]}
      className={cn("px-1.5 capitalize", props.className)}
    >
      {getTeamPlanBadgeLabel(props.plan)}
    </Badge>
  );
}
