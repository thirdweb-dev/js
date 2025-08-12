"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { ListerOnly } from "@/components/contracts/roles/lister-only";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TabButtons } from "@/components/ui/tabs";
import { CreateListingsForm } from "./list-form";

interface CreateListingButtonProps {
  contract: ThirdwebContract;
  createText?: string;
  type?: "direct-listings" | "english-auctions";
  isLoggedIn: boolean;
  isInsightSupported: boolean;
}

const LISTING_MODES = ["Select NFT", "Manual"] as const;

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  createText = "Create",
  type,
  contract,
  isLoggedIn,
  isInsightSupported,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const [open, setOpen] = useState(false);
  const [listingMode, setListingMode] =
    useState<(typeof LISTING_MODES)[number]>("Select NFT");

  return (
    <ListerOnly contract={contract}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button
            {...restButtonProps}
            disabled={!address}
            className="gap-2"
            size="sm"
          >
            <PlusIcon className="size-4" />
            {createText}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:min-w-[540px] lg:min-w-[700px]">
          <SheetHeader>
            <SheetTitle className="mb-3 text-left">{createText}</SheetTitle>
          </SheetHeader>
          {/*
          If the chain is not supported by the indexer providers
          we don't show the tabs, we only show the Manual input form.
          Otherwise we show both */}
          {isInsightSupported ? (
            <>
              <TabButtons
                tabs={LISTING_MODES.map((mode) => ({
                  isActive: mode === listingMode,
                  name: mode,
                  onClick: () => setListingMode(mode),
                }))}
              />
              <div className="mt-5">
                <CreateListingsForm
                  actionText={createText}
                  contract={contract}
                  isInsightSupported={isInsightSupported}
                  isLoggedIn={isLoggedIn}
                  mode={listingMode === "Select NFT" ? "automatic" : "manual"}
                  setOpen={setOpen}
                  type={type}
                />
              </div>
            </>
          ) : (
            <div className="mt-5">
              <CreateListingsForm
                actionText={createText}
                contract={contract}
                isInsightSupported={isInsightSupported}
                isLoggedIn={isLoggedIn}
                mode="manual"
                setOpen={setOpen}
                type={type}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ListerOnly>
  );
};
