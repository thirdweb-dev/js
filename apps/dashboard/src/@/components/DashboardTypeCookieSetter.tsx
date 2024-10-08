"use client";

import { useEffect } from "react";
import { setCookie } from "../../stores/SyncStoreToCookies";

export function DashboardTypeCookieSetter(props: {
  type: "team" | "old";
}) {
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    setCookie("x-dashboard-type", props.type);
  }, [props.type]);

  return null;
}
