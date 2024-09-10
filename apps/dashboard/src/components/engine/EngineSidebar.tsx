"use client";

import { MobileSidebar } from "@/components/blocks/MobileSidebar";
import { Sidebar } from "@/components/blocks/Sidebar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Overview",
    exactMatch: true,
    href: "/dashboard/engine",
  },
  {
    label: "Create",
    href: "/dashboard/engine/create",
  },
  {
    label: "Import",
    href: "/dashboard/engine/import",
  },
];

export function EngineSidebar() {
  return <Sidebar links={links} />;
}

export function EngineMobileSidebar() {
  const pathname = usePathname();
  const activeLink = links.find((link) => pathname === link.href);
  return (
    <MobileSidebar
      links={links}
      trigger={
        <Button
          className="w-full lg:hidden text-left justify-between gap-2 mb-6"
          variant="outline"
        >
          {activeLink?.label || "Connect"}
          <ChevronDownIcon className="size-5 text-muted-foreground" />
        </Button>
      }
    />
  );
}
