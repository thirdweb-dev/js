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
import { LazyMintNftForm } from "./lazy-mint-form";

interface NFTLazyMintButtonProps {
  contract: ThirdwebContract;
  isErc721: boolean;
  twAccount: Account | undefined;
}

export const NFTLazyMintButton: React.FC<NFTLazyMintButtonProps> = ({
  contract,
  isErc721,
  twAccount,
  ...restButtonProps
}) => {
  const [open, setOpen] = useState(false);
  return (
    <MinterOnly contract={contract}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="primary" className="gap-2" {...restButtonProps}>
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
            setOpen={setOpen}
            twAccount={twAccount}
          />
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
