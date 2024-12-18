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
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { isAlchemySupported } from "lib/wallet/nfts/alchemy";
import { isMoralisSupported } from "lib/wallet/nfts/moralis";
import { isSimpleHashSupported } from "lib/wallet/nfts/simpleHash";
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

const LISTING_MODES = ["Select NFT", "Manual"] as const;

export const CreateListingButton: React.FC<CreateListingButtonProps> = ({
  createText = "Create",
  type,
  contract,
  twAccount,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const [open, setOpen] = useState(false);
  const [listingMode, setListingMode] =
    useState<(typeof LISTING_MODES)[number]>("Select NFT");
  const isSupportedChain =
    contract.chain.id &&
    (isSimpleHashSupported(contract.chain.id) ||
      isAlchemySupported(contract.chain.id) ||
      isMoralisSupported(contract.chain.id));
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
            <SheetTitle className="mb-3 text-left">{createText}</SheetTitle>
          </SheetHeader>
          {/*
          If the chain is not supported by the indexer providers
          we don't show the tabs, we only show the Manual input form.
          Otherwise we show both */}
          {isSupportedChain ? (
            <>
              <TabButtons
                tabs={LISTING_MODES.map((mode) => ({
                  name: mode,
                  isActive: mode === listingMode,
                  onClick: () => setListingMode(mode),
                  isEnabled: true,
                }))}
                tabClassName="text-sm gap-2 !text-sm"
                tabContainerClassName="gap-0.5"
              />
              <div className="mt-5">
                <CreateListingsForm
                  twAccount={twAccount}
                  contract={contract}
                  type={type}
                  actionText={createText}
                  setOpen={setOpen}
                  mode={listingMode === "Select NFT" ? "automatic" : "manual"}
                />
              </div>
            </>
          ) : (
            <div className="mt-5">
              <CreateListingsForm
                twAccount={twAccount}
                contract={contract}
                type={type}
                actionText={createText}
                setOpen={setOpen}
                mode="manual"
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ListerOnly>
  );
};
