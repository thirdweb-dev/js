"use client";

import { MobileSidebar } from "@/components/blocks/MobileSidebar";
import type { SidebarLink } from "@/components/blocks/Sidebar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function EngineGeneralPageMobileSidebar(props: {
  links: SidebarLink[];
}) {
  const { links } = props;
  const pathname = usePathname();
  const activeLink = links.find((link) => link.href === pathname);

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
