"use client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { MinterOnly } from "@/components/contracts/roles/minter-only";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SharedMetadataForm } from "./shared-metadata-form";

export function NFTSharedMetadataButton({
  contract,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <MinterOnly contract={contract}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button className="gap-2" variant="primary">
            <PlusIcon className="size-5" /> Set NFT Metadata
          </Button>
        </SheetTrigger>
        <SheetContent className="!w-full lg:!max-w-2xl overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-left">Set NFT Metadata</SheetTitle>
          </SheetHeader>
          <SharedMetadataForm
            contract={contract}
            isLoggedIn={isLoggedIn}
            setOpen={setOpen}
          />
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
}
