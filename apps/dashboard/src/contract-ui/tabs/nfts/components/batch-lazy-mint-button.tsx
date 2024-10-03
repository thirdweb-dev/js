"use client";

import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { useDisclosure } from "@chakra-ui/react";
import { BatchLazyMint } from "core-ui/batch-upload/batch-lazy-mint";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FileStackIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Drawer } from "tw-components";

interface BatchLazyMintButtonProps {
  canCreateDelayedRevealBatch: boolean;
  contract: ThirdwebContract;
  isErc721: boolean;
}

export const BatchLazyMintButton: React.FC<BatchLazyMintButtonProps> = ({
  contract,
  canCreateDelayedRevealBatch,
  isErc721,
}) => {
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="full"
        onClose={onClose}
        isOpen={isOpen}
      >
        <BatchLazyMint
          chainId={contract.chain.id}
          onSubmit={async ({ revealType, data }) => {
            // nice, we can set up everything the same for both the only thing that changes is the action string
            const action = `batch-upload-${revealType}` as const;

            trackEvent({
              category: "nft",
              action,
              label: "attempt",
            });
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

              trackEvent({
                category: "nft",
                action,
                label: "success",
              });
              txNotifications.onSuccess();
              onClose();
            } catch (error) {
              trackEvent({
                category: "nft",
                action,
                label: "error",
                error,
              });
              txNotifications.onError(error);
            }
          }}
          nextTokenIdToMint={nextTokenIdToMintQuery.data || 0n}
          canCreateDelayedRevealBatch={canCreateDelayedRevealBatch}
        />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<FileStackIcon className="size-4" />}
        onClick={onOpen}
      >
        Batch Upload
      </Button>
    </MinterOnly>
  );
};
