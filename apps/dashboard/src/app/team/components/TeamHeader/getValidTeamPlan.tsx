import type { Team } from "@/api/team";

export function getValidTeamPlan(team: Team): Team["billingPlan"] {
  if (
    team.billingStatus !== "validPayment" &&
    team.billingStatus !== "pastDue"
  ) {
    return "free";
  }

  return team.billingPlan;
}
