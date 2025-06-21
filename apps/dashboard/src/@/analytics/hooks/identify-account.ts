"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export function useIdentifyAccount(opts?: {
  accountId: string;
  email?: string;
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // if no accountId, don't identify
    if (!opts?.accountId) {
      return;
    }

    // if email is provided, add it to the identify
    posthog.identify(opts.accountId, opts.email ? { email: opts.email } : {});
  }, [opts?.accountId, opts?.email]);
}
