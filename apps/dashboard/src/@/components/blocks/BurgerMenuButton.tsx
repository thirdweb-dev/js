"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { NavLink } from "../ui/NavLink";

export function BurgerMenuButton(props: {
  links?: { href: string; label: React.ReactNode }[];
  footer?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <MenuIcon strokeWidth={1} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-6 rounded-xl"
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
