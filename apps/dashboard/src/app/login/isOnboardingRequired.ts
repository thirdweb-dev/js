import type { Account } from "@3rdweb-sdk/react/hooks/useApi";

export function isOnboardingComplete(account: Account) {
  // if email is confirmed, onboarding is considered complete
  return !!account.emailConfirmedAt;
}
