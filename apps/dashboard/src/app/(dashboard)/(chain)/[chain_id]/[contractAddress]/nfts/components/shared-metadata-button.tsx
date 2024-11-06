"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { Button } from "tw-components";
import { SharedMetadataForm } from "./shared-metadata-form";

interface NFTSharedMetadataButtonProps {
  contract: ThirdwebContract;
}

export const NFTSharedMetadataButton: React.FC<
  NFTSharedMetadataButtonProps
> = ({ contract, ...restButtonProps }) => {
  const [open, setOpen] = useState(false);
  return (
    <MinterOnly contract={contract}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            colorScheme="primary"
            leftIcon={<PlusIcon className="size-5" />}
            {...restButtonProps}
          >
            Set NFT Metadata
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="text-left">Set NFT Metadata</SheetTitle>
          </SheetHeader>
          <SharedMetadataForm contract={contract} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
