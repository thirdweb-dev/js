"use client";

import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { BatchLazyMint } from "core-ui/batch-upload/batch-lazy-mint";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FileStackIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface BatchLazyMintButtonProps {
  canCreateDelayedRevealBatch: boolean;
  contract: ThirdwebContract;
  isErc721: boolean;
  isLoggedIn: boolean;
}

export const BatchLazyMintButton: React.FC<BatchLazyMintButtonProps> = ({
  contract,
  canCreateDelayedRevealBatch,
  isErc721,
  isLoggedIn,
}) => {
  const [open, setOpen] = useState(false);

  const nextTokenIdToMintQuery = useReadContract(
    isErc721 ? ERC721Ext.nextTokenIdToMint : ERC1155Ext.nextTokenIdToMint,
    {
      contract,
    },
  );

  const sendTxMutation = useSendAndConfirmTransaction();

  const txNotifications = useTxNotifications(
    "Batch uploaded successfully",
    "Error uploading batch",
    contract,
  );
  if (!contract) {
    return null;
  }

  return (
    <MinterOnly contract={contract}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button className="gap-2" variant="primary">
            <FileStackIcon className="size-4" />
            Batch Upload
          </Button>
        </SheetTrigger>
        <SheetContent className="min-w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-left">Upload NFTs</SheetTitle>
          </SheetHeader>
          <BatchLazyMint
            canCreateDelayedRevealBatch={canCreateDelayedRevealBatch}
            chainId={contract.chain.id}
            client={contract.client}
            isLoggedIn={isLoggedIn}
            nextTokenIdToMint={nextTokenIdToMintQuery.data || 0n}
            onSubmit={async ({ revealType, data }) => {
              try {
                const tx = (() => {
                  switch (true) {
                    // lazy mint erc721
                    case revealType === "instant" && isErc721: {
                      return ERC721Ext.lazyMint({
                        contract,
                        nfts: data.metadatas,
                      });
                    }
                    // lazy mint erc1155
                    case revealType === "instant" && !isErc721: {
                      return ERC1155Ext.lazyMint({
                        contract,
                        nfts: data.metadatas,
                      });
                    }
                    // delayed reveal erc721
                    case revealType === "delayed": {
                      return ERC721Ext.createDelayedRevealBatch({
                        contract,
                        metadata: data.metadata,
                        password: data.password,
                        placeholderMetadata: data.placeholderMetadata,
                      });
                    }
                    default: {
                      throw new Error("Invalid reveal type");
                    }
                  }
                })();

                await sendTxMutation.mutateAsync(tx);

                txNotifications.onSuccess();
                setOpen(false);
              } catch (error) {
                console.error(error);
                txNotifications.onError(error);
              }
            }}
          />
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
