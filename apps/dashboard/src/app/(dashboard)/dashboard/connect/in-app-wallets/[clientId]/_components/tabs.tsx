"use client";
import { TabLinks } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export function Tabs({ clientId }: { clientId: string }) {
  const path = usePathname();

  return (
    <TabLinks
      links={[
        {
          name: "Analytics",
          href: `/dashboard/connect/in-app-wallets/${clientId}/analytics`,
          isActive: path?.endsWith("/analytics") || false,
          isDisabled: false,
        },
        {
          name: "Users",
          href: `/dashboard/connect/in-app-wallets/${clientId}/users`,
          isActive: path?.endsWith("/users") || false,
          isDisabled: false,
        },
        {
          name: "Configuration",
          href: `/dashboard/connect/in-app-wallets/${clientId}/config`,
          isActive: path?.endsWith("/config") || false,
          isDisabled: false,
        },
      ]}
    />
  );
}
