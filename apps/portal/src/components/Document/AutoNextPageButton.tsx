"use client";

import { usePathname } from "next/navigation";
import type { SidebarLink } from "@/components/others/Sidebar";
import { NextPageButton } from "./NextPageButton";
import { getNextPageFromSidebar } from "./utils/getNextPageFromSidebar";

export function AutoNextPageButton({
  sidebarLinks,
}: { sidebarLinks: SidebarLink[] }) {
  const pathname = usePathname();

  // Don't show next button on home page
  if (pathname === "/") {
    return null;
  }

  const nextPage = getNextPageFromSidebar(sidebarLinks, pathname);

  if (!nextPage) {
    return null;
  }

  return <NextPageButton href={nextPage.href} name={nextPage.name} />;
}
