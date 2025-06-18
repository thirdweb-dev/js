"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export function useIdentifyTeam(opts?: {
  teamId: string;
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    // if no teamId, don't identify
    if (!opts?.teamId) {
      return;
    }

    // identify the team
    posthog.group("team", opts.teamId);
  }, [opts?.teamId]);
}
