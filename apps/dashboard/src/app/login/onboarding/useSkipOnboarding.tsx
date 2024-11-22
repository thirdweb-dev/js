"use client";

import { useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useTrack } from "hooks/analytics/useTrack";

export function useSkipOnboarding() {
  const mutation = useUpdateAccount();
  const trackEvent = useTrack();

  async function skipOnboarding() {
    trackEvent({
      category: "account",
      action: "onboardSkippedBilling",
      label: "attempt",
    });

    return mutation.mutateAsync(
      {
        onboardSkipped: true,
      },
      {
        onSuccess: () => {
          trackEvent({
            category: "account",
            action: "onboardSkippedBilling",
            label: "success",
          });
        },
        onError: (error) => {
          trackEvent({
            category: "account",
            action: "onboardSkippedBilling",
            label: "error",
            error,
          });
        },
      },
    );
  }

  return skipOnboarding;
}
