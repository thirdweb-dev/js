import type { Team } from "@/api/team";

export function getValidTeamPlan(team: Team): Team["billingPlan"] {
  if (team.billingStatus !== "validPayment") {
    return "free";
  }

  return team.billingPlan;
}
