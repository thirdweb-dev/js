"use client";

import type { Team } from "@/api/team";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDashboardRouter } from "../../../@/lib/DashboardRouter";

const teamPlanToBadgeVariant: Record<
  Team["billingPlan"],
  BadgeProps["variant"]
> = {
  // gray
  free: "secondary",
  // yellow
  starter: "warning",

  growth_legacy: "warning",
  // green
  accelerate: "success",
  growth: "success",
  scale: "success",
  // blue
  pro: "default",
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
      variant={teamPlanToBadgeVariant[props.plan]}
      className={cn("px-1.5 capitalize", props.className)}
      role={props.plan === "free" ? "button" : undefined}
      tabIndex={props.plan === "free" ? 0 : undefined}
      onClick={handleNavigateToBilling}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleNavigateToBilling(e);
        }
      }}
    >
      {`${getTeamPlanBadgeLabel(props.plan)}${props.postfix || ""}`}
    </Badge>
  );
}
