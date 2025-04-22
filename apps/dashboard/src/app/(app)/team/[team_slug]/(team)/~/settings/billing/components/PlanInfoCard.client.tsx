"use client";

import { getBillingCheckoutUrl, getBillingPortalUrl } from "@/actions/billing";
import { apiServerProxy } from "@/actions/proxies";
import type { Team } from "@/api/team";
import type { TeamSubscription } from "@/api/team-subscription";
import { PlanInfoCardUI } from "./PlanInfoCard";

export function PlanInfoCardClient(props: {
  subscriptions: TeamSubscription[];
  team: Team;
}) {
  return (
    <PlanInfoCardUI
      team={props.team}
      subscriptions={props.subscriptions}
      getBillingPortalUrl={getBillingPortalUrl}
      getBillingCheckoutUrl={getBillingCheckoutUrl}
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
      cancelPlan={async (params) => {
        const res = await apiServerProxy<{
          data: {
            result: "success";
          };
        }>({
          pathname: `/v1/teams/${props.team.id}/checkout/cancel-plan`,
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(params),
        });

        if (!res.ok) {
          console.error(res.error);
          throw new Error(res.error);
        }
      }}
    />
  );
}
