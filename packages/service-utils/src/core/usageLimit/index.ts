import { CoreServiceConfig } from "../api";
import { AuthorizationResult } from "../authorize/types";

import { UsageLimitResult } from "./types";

export async function usageLimit(
  authzResult: AuthorizationResult,
  serviceConfig: CoreServiceConfig,
): Promise<UsageLimitResult> {
  if (!authzResult.authorized) {
    return {
      usageLimited: false,
    };
  }

  const { apiKeyMeta, accountMeta } = authzResult;
  const { limits, usage } = apiKeyMeta || accountMeta || {};
  const { serviceScope } = serviceConfig;

  if (
    !usage ||
    !(serviceScope in usage) ||
    !limits ||
    !(serviceScope in limits)
  ) {
    // No usage limit is provided. Assume the request is not limited.
    return {
      usageLimited: false,
    };
  }

  const limit = limits.storage as number;

  if (
    serviceScope === "storage" &&
    (usage.storage?.sumFileSizeBytes || 0) > limit
  ) {
    return {
      usageLimited: true,
      status: 403,
      errorMessage: `You've used all of your total usage limit for Storage Pinning. Please add your payment method at https://thirdweb.com/dashboard/settings/billing.`,
      errorCode: "PAYMENT_METHOD_REQUIRED",
    };
  }

  return {
    usageLimited: false,
  };
}
