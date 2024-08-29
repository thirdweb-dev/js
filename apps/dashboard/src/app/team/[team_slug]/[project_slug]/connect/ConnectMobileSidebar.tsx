"use client";

import { MobileSidebar } from "@/components/blocks/MobileSidebar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function ConnectMobileSidebar(props: {
  links: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  const activeLink = props.links.find((link) => pathname === link.href);
  return (
    <MobileSidebar
      links={props.links}
      trigger={
        <Button
          className="w-full lg:hidden text-left justify-between gap-2 bg-muted"
          variant="outline"
        >
          {activeLink?.label || "Connect"}
          <ChevronDownIcon className="size-5 text-muted-foreground" />
        </Button>
      }
    />
  );
}
