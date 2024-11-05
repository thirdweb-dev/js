"use client";
import { TabLinks } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export function Tabs({
  team_slug,
  project_slug,
}: { team_slug: string; project_slug: string }) {
  const path = usePathname();

  return (
    <TabLinks
      links={[
        {
          name: "Analytics",
          href: `/team/${team_slug}/${project_slug}/connect/in-app-wallets/analytics`,
          isActive: path?.endsWith("/analytics") || false,
          isDisabled: false,
        },
        {
          name: "Users",
          href: `/team/${team_slug}/${project_slug}/connect/in-app-wallets/users`,
          isActive: path?.endsWith("/users") || false,
          isDisabled: false,
        },
        {
          name: "Configuration",
          href: `/team/${team_slug}/${project_slug}/connect/in-app-wallets/config`,
          isActive: path?.endsWith("/config") || false,
          isDisabled: false,
        },
      ]}
    />
  );
}
