"use client";

import { DropletIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TokenAirdropForm } from "./airdrop-form";

export function TokenAirdropButton(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <DropletIcon className="size-4" /> Airdrop
        </Button>
      </SheetTrigger>
      <SheetContent className="!w-full lg:!max-w-3xl flex flex-col gap-0">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left">Airdrop tokens</SheetTitle>
        </SheetHeader>
        <TokenAirdropForm
          contract={props.contract}
          isLoggedIn={props.isLoggedIn}
        />
      </SheetContent>
    </Sheet>
  );
}
