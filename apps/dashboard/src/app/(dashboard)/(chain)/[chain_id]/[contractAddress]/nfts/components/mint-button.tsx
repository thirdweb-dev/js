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
import { NFTMintForm } from "./mint-form";

interface NFTMintButtonProps {
  contract: ThirdwebContract;
  isErc721: boolean;
}

export const NFTMintButton: React.FC<NFTMintButtonProps> = ({
  contract,
  isErc721,
  ...restButtonProps
}) => {
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
            Mint
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="text-left">Mint NFT</SheetTitle>
          </SheetHeader>
          <NFTMintForm
            contract={contract}
            isErc721={isErc721}
            setOpen={setOpen}
          />
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
