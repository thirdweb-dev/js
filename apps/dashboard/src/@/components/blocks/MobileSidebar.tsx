"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { NavLink } from "../ui/NavLink";
import type { SidebarLink } from "./Sidebar";

export function MobileSidebar(props: {
  links?: SidebarLink[];
  footer?: React.ReactNode;
  trigger?: React.ReactNode;
  triggerClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const activeLink = props.links?.find((link) => {
    if (link.exactMatch) {
      return link.href === pathname;
    }
    return pathname?.startsWith(link.href);
  });

  const defaultTrigger = (
    <Button
      className={cn(
        "w-full justify-between gap-2 bg-muted/50 text-left lg:hidden",
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
        className="rounded-t-xl rounded-b-none p-4"
        dialogCloseClassName="hidden"
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setIsOpen(false);
          }
        }}
      >
        <div className="flex flex-col gap-2">
          {props.links?.map((link) => {
            return (
              <Button size="sm" variant="ghost" asChild key={link.href}>
                <NavLink
                  href={link.href}
                  className="!text-left flex h-auto justify-start gap-2 py-3"
                  activeClassName="bg-accent"
                  exactMatch={link.exactMatch}
                  tracking={link.tracking}
                >
                  {link.label}
                </NavLink>
              </Button>
            );
          })}
        </div>
        {props.footer}
      </DialogContent>
    </Dialog>
  );
}
