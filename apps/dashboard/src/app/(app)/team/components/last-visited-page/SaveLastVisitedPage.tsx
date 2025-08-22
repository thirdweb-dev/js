"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { HAS_USED_DASHBOARD, LAST_USED_TEAM_ID } from "@/constants/cookie";
import { setCookie } from "@/utils/cookie";
import { LAST_VISITED_TEAM_PAGE_PATH } from "./consts";

export function SaveLastVisitedTeamPage(props: { teamId: string }) {
  const pathname = usePathname();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setCookie(LAST_VISITED_TEAM_PAGE_PATH, pathname);
    setCookie(LAST_USED_TEAM_ID, props.teamId);
    setCookie(HAS_USED_DASHBOARD, "true");
  }, [pathname, props.teamId]);

  return null;
}
