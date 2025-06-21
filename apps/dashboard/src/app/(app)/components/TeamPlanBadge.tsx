"use client";

import type { Team } from "@/api/team";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDashboardRouter } from "../../../@/lib/DashboardRouter";

const teamPlanToBadgeVariant: Record<
  Team["billingPlan"],
  BadgeProps["variant"]
> = {
  // green
  accelerate: "success",
  // gray
  free: "secondary",
  growth: "success",

  growth_legacy: "warning",
  // blue
  pro: "default",
  scale: "success",
  // yellow
  starter: "warning",
};

export function getTeamPlanBadgeLabel(plan: Team["billingPlan"]) {
  if (plan === "growth_legacy") {
    return "Growth - Legacy";
  }

  return plan;
}

export function TeamPlanBadge(props: {
  teamSlug: string;
  plan: Team["billingPlan"];
  className?: string;
  postfix?: string;
}) {
  const router = useDashboardRouter();

  function handleNavigateToBilling(e: React.MouseEvent | React.KeyboardEvent) {
    if (props.plan !== "free") {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    router.push(`/team/${props.teamSlug}/~/settings/billing?showPlans=true`);
  }

  return (
    <Badge
      className={cn("px-1.5 capitalize", props.className)}
      onClick={handleNavigateToBilling}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleNavigateToBilling(e);
        }
      }}
      role={props.plan === "free" ? "button" : undefined}
      tabIndex={props.plan === "free" ? 0 : undefined}
      variant={teamPlanToBadgeVariant[props.plan]}
    >
      {`${getTeamPlanBadgeLabel(props.plan)}${props.postfix || ""}`}
    </Badge>
  );
}
