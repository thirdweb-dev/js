import type { Team } from "@/api/team";

export function getValidTeamPlan(team: Team): Team["billingPlan"] {
  switch (true) {
    case team.billingPlan === "pro" && team.billingStatus === "validPayment": {
      return "pro";
    }
    case team.billingPlan === "growth" &&
      team.billingStatus === "validPayment": {
      return "growth";
    }

    default: {
      return "free";
    }
  }
}
