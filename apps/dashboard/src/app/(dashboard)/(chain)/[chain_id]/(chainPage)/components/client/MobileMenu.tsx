"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import type { ChainMetadata } from "thirdweb/chains";
import { SidebarContent } from "../server/sidebar-content";

export function MobileMenu(props: {
  chain: ChainMetadata;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <MenuIcon strokeWidth={1} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="p-0"
        dialogCloseClassName="hidden"
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setIsOpen(false);
          }
        }}
      >
        <SidebarContent chain={props.chain} />
      </DialogContent>
    </Dialog>
  );
}
