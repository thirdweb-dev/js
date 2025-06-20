"use client";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LazyMintNftForm } from "./lazy-mint-form";

interface NFTLazyMintButtonProps {
  contract: ThirdwebContract;
  isErc721: boolean;
  isLoggedIn: boolean;
}

export const NFTLazyMintButton: React.FC<NFTLazyMintButtonProps> = ({
  contract,
  isErc721,
  isLoggedIn,
  ...restButtonProps
}) => {
  const [open, setOpen] = useState(false);
  return (
    <MinterOnly contract={contract}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button className="gap-2" variant="primary" {...restButtonProps}>
            <PlusIcon className="size-5" />
            Single Upload
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="text-left">Mint NFT</SheetTitle>
          </SheetHeader>
          <LazyMintNftForm
            contract={contract}
            isErc721={isErc721}
            isLoggedIn={isLoggedIn}
            setOpen={setOpen}
          />
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
