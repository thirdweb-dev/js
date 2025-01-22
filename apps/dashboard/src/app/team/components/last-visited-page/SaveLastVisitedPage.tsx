"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { setCookie } from "../../../../lib/cookie";
import { LAST_VISITED_TEAM_PAGE_PATH } from "./consts";

export function SaveLastVisitedTeamPage() {
  const pathname = usePathname();

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setCookie(LAST_VISITED_TEAM_PAGE_PATH, pathname);
  }, [pathname]);

  return null;
}
