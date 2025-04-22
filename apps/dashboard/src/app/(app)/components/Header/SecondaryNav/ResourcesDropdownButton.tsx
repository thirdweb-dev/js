"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";

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
            variant="link"
            className="!p-0 !h-auto hover:!no-underline gap-1 font-normal text-muted-foreground text-sm hover:text-foreground"
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
