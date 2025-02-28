import type { Team } from "@/api/team";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";

export function isAccountOnboardingComplete(account: Account) {
  // if email is confirmed, onboarding is considered complete
  return !!account.emailConfirmedAt;
}

export function isTeamOnboardingComplete(team: Team) {
  return team.isOnboarded;
}
