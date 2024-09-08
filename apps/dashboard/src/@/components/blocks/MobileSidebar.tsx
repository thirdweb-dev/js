"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { NavLink } from "../ui/NavLink";
import type { SidebarLink } from "./Sidebar";

export function MobileSidebar(props: {
  links?: SidebarLink[];
  footer?: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent
        className="p-4 rounded-t-xl rounded-b-none"
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
                  className="!text-left justify-start flex gap-2 h-auto py-3"
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
