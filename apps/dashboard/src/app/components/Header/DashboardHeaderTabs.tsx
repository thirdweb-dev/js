"use client";

import { TabLinks } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export function DashboardHeaderTabs() {
  const pathname = usePathname() || "";
  return (
    <TabLinks
      className="w-full"
      tabContainerClassName="px-4"
      shadowColor="transparent"
      links={[
        {
          href: "/dashboard",
          name: "Home",
          isActive: pathname === "/dashboard",
        },
        {
          href: "/dashboard/connect/analytics",
          name: "Connect",
          isActive: pathname.startsWith("/dashboard/connect"),
        },
        {
          href: "/dashboard/contracts/deploy",
          name: "Contracts",
          isActive: pathname.startsWith("/dashboard/contracts"),
        },
        {
          href: "/dashboard/engine",
          name: "Engine",
          isActive: pathname.startsWith("/dashboard/engine"),
        },
        {
          href: "/dashboard/settings/api-keys",
          name: "Settings",
          isActive: pathname.startsWith("/dashboard/settings"),
        },
      ]}
    />
  );
}
