import type { Team } from "../../@/api/team";

export type OnboardingScreen =
  | { id: "onboarding" }
  | { id: "linking" }
  | { id: "confirming" }
  | { id: "confirmLinking" }
  | { id: "plan"; team: Team };
