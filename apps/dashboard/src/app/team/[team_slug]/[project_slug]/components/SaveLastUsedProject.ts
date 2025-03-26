"use client";

import { useEffect } from "react";

export const LAST_USED_PROJECT_ID = "last-used-project-id";
export const LAST_USED_TEAM_ID = "last-used-team-id";

export function SaveLastUsedProject(props: {
  projectId: string;
  teamId: string;
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    try {
      localStorage.setItem(LAST_USED_PROJECT_ID, props.projectId);
      localStorage.setItem(LAST_USED_TEAM_ID, props.teamId);
    } catch {
      // ignore localStorage errors
    }
  }, [props.projectId, props.teamId]);

  return null;
}
