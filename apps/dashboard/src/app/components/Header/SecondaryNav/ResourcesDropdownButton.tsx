"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CmdKSearchModal } from "components/cmd-k-search";
import { ChevronDownIcon, CommandIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ResourcesDropdownButton() {
  const [isCMDSearchModalOpen, setIsCMDSearchModalOpen] = useState(false);
  return (
    <>
      <CmdKSearchModal
        open={isCMDSearchModalOpen}
        setOpen={setIsCMDSearchModalOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="link"
            className="text-muted-foreground text-sm gap-1 !p-0 !h-auto hover:!no-underline hover:text-foreground font-normal"
          >
            Resources
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[230px]" sideOffset={14}>
          <DropdownMenuItem>
            <Link href="/chainlist" className="w-full p-1">
              Chainlist
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href="https://playground.thirdweb.com/"
              target="_blank"
              className="w-full p-1"
            >
              Playground
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/explore" className="w-full p-1">
              Explore Contracts
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/trending" className="w-full p-1">
              Popular Contracts
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="text-sm gap-2 !p-1 !h-auto text-left justify-between w-full"
              onClick={() => setIsCMDSearchModalOpen(true)}
            >
              Search Contracts
              <span className="items-center flex gap-0.5 text-xs text-muted-foreground">
                <CommandIcon className="size-3" />K
              </span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
