"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TabButtons } from "@/components/ui/tabs";
import { ListerOnly } from "@3rdweb-sdk/react/components/roles/lister-only";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { CreateListingsForm } from "./list-form";
import { ListFormManual } from "./list-form-manual.client";

interface CreateListingButtonProps {
  contract: ThirdwebContract;
  createText?: string;
  type?: "direct-listings" | "english-auctions";
}

const LISTING_MODES = ["Selection", "Manual"] as const;

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  createText = "Create",
  type,
  contract,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const [open, setOpen] = useState(false);
  const [listingMode, setListingMode] =
    useState<(typeof LISTING_MODES)[number]>("Selection");

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
            <SheetTitle className="text-left">{createText}</SheetTitle>
          </SheetHeader>
          <TabButtons
            tabs={LISTING_MODES.map((mode) => ({
              name: mode,
              isActive: mode === listingMode,
              onClick: () => setListingMode(mode),
              isEnabled: true,
            }))}
            tabClassName="text-sm gap-2 !text-sm"
            tabContainerClassName="px-3 pt-1.5 gap-0.5"
          />
          <div className="mt-5 px-3">
            {listingMode === "Selection" ? (
              <CreateListingsForm
                contract={contract}
                type={type}
                actionText={createText}
                setOpen={setOpen}
              />
            ) : (
              <ListFormManual
                contract={contract}
                type={type}
                actionText={createText}
                setOpen={setOpen}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </ListerOnly>
  );
};
