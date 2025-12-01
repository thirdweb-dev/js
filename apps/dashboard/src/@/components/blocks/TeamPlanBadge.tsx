"use client";

import type { Team } from "@/api/team/get-team";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";

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

export function getTeamPlanBadgeLabel(
  plan: Team["billingPlan"],
  isLegacyPlan: boolean,
) {
  if (plan === "growth_legacy") {
    return "Growth - Legacy";
  }

  if (isLegacyPlan) {
    return `${plan} - Legacy`;
  }

  return plan;
}

export function TeamPlanBadge(props: {
  teamSlug: string;
  plan: Team["billingPlan"];
  isLegacyPlan: boolean;
  className?: string;
  postfix?: string;
}) {
  const router = useDashboardRouter();

  function handleNavigateToBilling(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (props.isLegacyPlan) {
      router.push(`/team/${props.teamSlug}/~/billing`);
      return;
    }

    if (props.plan !== "free") {
      return;
    }
    router.push(`/team/${props.teamSlug}/~/billing?showPlans=true`);
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
      role={props.plan === "free" || props.isLegacyPlan ? "button" : undefined}
      tabIndex={props.plan === "free" || props.isLegacyPlan ? 0 : undefined}
      variant={
        props.isLegacyPlan ? "warning" : teamPlanToBadgeVariant[props.plan]
      }
    >
      {`${getTeamPlanBadgeLabel(props.plan, props.isLegacyPlan)}${props.postfix || ""}`}
    </Badge>
  );
}
