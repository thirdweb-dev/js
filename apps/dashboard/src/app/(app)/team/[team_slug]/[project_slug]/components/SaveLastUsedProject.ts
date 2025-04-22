"use client";

import { LAST_USED_PROJECT_ID, LAST_USED_TEAM_ID } from "constants/cookies";
import { setCookie } from "lib/cookie";
import { useEffect } from "react";

export function SaveLastUsedProject(props: {
  projectId: string;
  teamId: string;
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    try {
      setCookie(LAST_USED_PROJECT_ID, props.projectId);
      setCookie(LAST_USED_TEAM_ID, props.teamId);
    } catch {
      // ignore localStorage errors
    }
  }, [props.projectId, props.teamId]);

  return null;
}
