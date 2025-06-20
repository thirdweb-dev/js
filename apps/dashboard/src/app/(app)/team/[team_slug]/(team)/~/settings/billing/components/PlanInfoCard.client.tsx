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
  isOwnerAccount: boolean;
}) {
  return (
    <PlanInfoCardUI
      getTeam={async () => {
        const res = await apiServerProxy<{
          result: Team;
        }>({
          method: "GET",
          pathname: `/v1/teams/${props.team.slug}`,
        });

        if (!res.ok) {
          throw new Error(res.error);
        }

        return res.data.result;
      }}
      highlightPlan={props.highlightPlan}
      isOwnerAccount={props.isOwnerAccount}
      openPlanSheetButtonByDefault={props.openPlanSheetButtonByDefault}
      subscriptions={props.subscriptions}
      team={props.team}
    />
  );
}
