import type { Account } from "@/hooks/useApi";

export function isAccountOnboardingComplete(account: Account) {
  // if email is confirmed, onboarding is considered complete
  return !!account.emailConfirmedAt;
}
