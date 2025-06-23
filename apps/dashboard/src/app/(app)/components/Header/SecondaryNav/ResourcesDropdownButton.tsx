"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ResourcesDropdownButton() {
  // const [isCMDSearchModalOpen, setIsCMDSearchModalOpen] = useState(false);
  return (
    <>
      {/* <CmdKSearchModal
        open={isCMDSearchModalOpen}
        setOpen={setIsCMDSearchModalOpen}
      /> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="!p-0 !h-auto hover:!no-underline gap-1 font-normal text-muted-foreground text-sm hover:text-foreground"
            variant="link"
          >
            Resources
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[230px]" sideOffset={14}>
          <DropdownMenuItem>
            <Link className="w-full p-1" href="/chainlist">
              Chainlist
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              className="w-full p-1"
              href="https://playground.thirdweb.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Playground
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link className="w-full p-1" href="/explore">
              Explore Contracts
            </Link>
          </DropdownMenuItem>

          {/* This will be enabled later */}
          {/* <DropdownMenuItem className="hidden">
            <Button
              variant="ghost"
              className="!p-1 !h-auto w-full justify-between gap-2 text-left text-sm"
              onClick={() => setIsCMDSearchModalOpen(true)}
            >
              Search Contracts
              <span className="flex items-center gap-0.5 text-muted-foreground text-xs">
                <CommandIcon className="size-3" />K
              </span>
            </Button>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
