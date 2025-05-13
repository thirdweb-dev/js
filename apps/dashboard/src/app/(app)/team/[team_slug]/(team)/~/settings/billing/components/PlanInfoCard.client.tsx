"use client";
import { apiServerProxy } from "@/actions/proxies";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { PlanInfoCardUI } from "./PlanInfoCard";

export function PlanInfoCardClient(props: {
  subscriptions: TeamSubscription[];
  team: Team;
  openPlanSheetButtonByDefault: boolean;
  highlightPlan: Team["billingPlan"] | undefined;
}) {
  return (
    <PlanInfoCardUI
      openPlanSheetButtonByDefault={props.openPlanSheetButtonByDefault}
      team={props.team}
      subscriptions={props.subscriptions}
      getTeam={async () => {
        const res = await apiServerProxy<{
          result: Team;
        }>({
          pathname: `/v1/teams/${props.team.slug}`,
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        return res.data.result;
      }}
      highlightPlan={props.highlightPlan}
    />
  );
}
