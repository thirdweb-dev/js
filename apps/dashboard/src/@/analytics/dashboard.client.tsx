"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import type { Account } from "../../@3rdweb-sdk/react/hooks/useApi";

const warnedMessages = new Set<string>();
function warnOnce(message: string) {
  if (warnedMessages.has(message)) {
    return;
  }
  warnedMessages.add(message);
  console.warn(message);
}

export function AccountIdentifier(props: {
  account: Pick<Account, "id" | "email">;
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!posthog.__loaded) {
      warnOnce(
        "[DASHBOARD_ANALYTICS] is not initialized, cannot identify user",
      );
      return;
    }
    posthog.identify(props.account.id, {
      ...(props.account.email ? { email: props.account.email } : {}),
    });
  }, [props.account.id, props.account.email]);
  return null;
}

export function TeamIdentifier(props: {
  teamId: string;
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!posthog.__loaded) {
      warnOnce(
        "[DASHBOARD_ANALYTICS] is not initialized, cannot identify team",
      );
      return;
    }
    posthog.group("team", props.teamId);
  }, [props.teamId]);
  return null;
}

export function reset() {
  if (!posthog.__loaded) {
    warnOnce("[DASHBOARD_ANALYTICS] is not initialized, cannot reset");
    return;
  }
  posthog.reset();
}
