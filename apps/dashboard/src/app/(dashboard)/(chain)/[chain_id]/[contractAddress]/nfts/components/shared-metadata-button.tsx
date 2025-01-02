"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { SharedMetadataForm } from "./shared-metadata-form";

interface NFTSharedMetadataButtonProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

export const NFTSharedMetadataButton: React.FC<
  NFTSharedMetadataButtonProps
> = ({ contract, twAccount, ...restButtonProps }) => {
  const [open, setOpen] = useState(false);
  return (
    <MinterOnly contract={contract}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="primary" className="gap-2" {...restButtonProps}>
            <PlusIcon className="size-5" /> Set NFT Metadata
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="text-left">Set NFT Metadata</SheetTitle>
          </SheetHeader>
          <SharedMetadataForm
            contract={contract}
            setOpen={setOpen}
            twAccount={twAccount}
          />
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
