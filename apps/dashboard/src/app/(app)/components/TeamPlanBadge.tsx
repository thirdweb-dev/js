"use client";

import type { Team } from "@/api/team";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTrack } from "hooks/analytics/useTrack";
import Link from "next/link";

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
  const badge = (
    <Badge
      variant={teamPlanToBadgeVariant[props.plan]}
      className={cn("px-1.5 capitalize", props.className)}
    >
      {`${getTeamPlanBadgeLabel(props.plan)}${props.postfix || ""}`}
    </Badge>
  );

  const track = useTrack();

  if (props.plan === "free") {
    return (
      <Link
        href={`/team/${props.teamSlug}/~/settings/billing?showPlans=true`}
        onClick={() => {
          track({
            category: "billing",
            action: "show_plans",
            label: "team_badge",
          });
        }}
      >
        {badge}
      </Link>
    );
  }

  return badge;
}
