"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { CreateListingsForm } from "./list-form";

interface CreateListingButtonProps {
  contract: ThirdwebContract;
  createText?: string;
  type?: "direct-listings" | "english-auctions";
  twAccount: Account | undefined;
}

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  createText = "Create",
  type,
  contract,
  twAccount,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const [open, setOpen] = useState(false);

  return (
    <ListerOnly contract={contract}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="primary" {...restButtonProps} disabled={!address}>
            {createText} <PlusIcon className="ml-2 size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="mb-5 text-left">{createText}</SheetTitle>
          </SheetHeader>
          <CreateListingsForm
            twAccount={twAccount}
            contract={contract}
            type={type}
            actionText={createText}
            setOpen={setOpen}
          />
        </SheetContent>
      </Sheet>
    </ListerOnly>
  );
};
