"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, CommandIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../../../@/components/ui/button";
import { CmdKSearchModal } from "../../../../components/cmd-k-search";

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
            className="text-muted-foreground text-sm gap-1 !p-0 !h-auto hover:!no-underline hover:text-foreground"
          >
            Resources
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 min-w-[230px]" sideOffset={14}>
          <div className="flex flex-col gap-4">
            <Link
              href="/chainlist"
              className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"
            >
              Chainlist
            </Link>

            <Link
              href="https://playground.thirdweb.com/"
              target="_blank"
              className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"
            >
              Playground
            </Link>

            <Link
              href="/explore"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Explore Contracts
            </Link>

            <Link
              href="/trending"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Popular Contracts
            </Link>

            <Button
              variant="link"
              className="text-muted-foreground text-sm gap-2 !p-0 !h-auto hover:!no-underline hover:text-foreground text-left justify-between"
              onClick={() => setIsCMDSearchModalOpen(true)}
            >
              Search Contracts
              <span className="items-center flex gap-0.5 text-xs opacity-80">
                <CommandIcon className="size-3" />K
              </span>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
