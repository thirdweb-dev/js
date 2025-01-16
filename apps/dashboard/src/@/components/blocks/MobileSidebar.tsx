"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import {
  RenderSidebarLinks,
  type SidebarBaseLink,
  type SidebarLink,
} from "./Sidebar";

export function MobileSidebar(props: {
  links: SidebarLink[];
  footer?: React.ReactNode;
  trigger?: React.ReactNode;
  triggerClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const activeLink = useMemo(() => {
    function isActive(link: SidebarBaseLink) {
      if (link.exactMatch) {
        return link.href === pathname;
      }
      return pathname?.startsWith(link.href);
    }

    for (const link of props.links) {
      if ("group" in link) {
        for (const subLink of link.links) {
          if (isActive(subLink)) {
            return subLink;
          }
        }
      } else {
        if (isActive(link)) {
          return link;
        }
      }
    }
  }, [props.links, pathname]);

  const defaultTrigger = (
    <Button
      className={cn(
        "w-full justify-between gap-2 bg-card text-left lg:hidden",
        props.triggerClassName,
      )}
      variant="outline"
    >
      {activeLink?.label}
      <ChevronDownIcon className="size-4 text-muted-foreground" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger || defaultTrigger}</DialogTrigger>
      <DialogContent
        className="no-scrollbar max-h-[80vh] overflow-auto rounded-t-xl rounded-b-none p-4"
        dialogCloseClassName="hidden"
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setIsOpen(false);
          }
        }}
      >
        <RenderSidebarLinks links={props.links} />
        {props.footer}
      </DialogContent>
    </Dialog>
  );
}
