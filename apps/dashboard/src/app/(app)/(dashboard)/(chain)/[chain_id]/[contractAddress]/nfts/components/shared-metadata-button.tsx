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

interface NFTSharedMetadataButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

export const NFTSharedMetadataButton: React.FC<
  NFTSharedMetadataButtonProps
> = ({ contract, isLoggedIn, ...restButtonProps }) => {
  const [open, setOpen] = useState(false);
  return (
    <MinterOnly contract={contract}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button className="gap-2" variant="primary" {...restButtonProps}>
            <PlusIcon className="size-5" /> Set NFT Metadata
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
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
};
