"use client";

import { type TabLink, TabLinks } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export default function TeamTabs(props: {
  links: (Omit<TabLink, "isActive" | "isEnabled"> & {
    strictMatch?: boolean;
  })[];
}) {
  const pathname = usePathname();
  return (
    <TabLinks
      tabContainerClassName="px-4 lg:px-6"
      links={props.links.map((l, i) => ({
        ...l,
        isActive: l.strictMatch
          ? pathname === l.href
          : pathname
            ? pathname.startsWith(l.href)
            : i === 0,
        isEnabled: true,
      }))}
    />
  );
}
