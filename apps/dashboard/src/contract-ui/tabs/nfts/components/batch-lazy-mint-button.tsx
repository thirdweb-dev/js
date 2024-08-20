import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  type RevealableContract,
  type useContract,
  useDelayedRevealLazyMint,
  useLazyMint,
} from "@thirdweb-dev/react";
import { BatchLazyMint } from "core-ui/batch-upload/batch-lazy-mint";
import {
  ProgressBox,
  type UploadProgressEvent,
} from "core-ui/batch-upload/progress-box";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import type { ThirdwebContract } from "thirdweb";
import { nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { useReadContract } from "thirdweb/react";
import { Button, Drawer } from "tw-components";

interface BatchLazyMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
  isRevealable: boolean;
  contract: ThirdwebContract;
}

export const BatchLazyMintButton: React.FC<BatchLazyMintButtonProps> = ({
  contractQuery,
  contract,
  isRevealable,
  ...restButtonProps
}) => {
  const contractV4 = contractQuery.contract;
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Both ERC721 and ERC1155 have the same function signature for nextTokenIdToMint,
  // so we can just use either one.
  const nextTokenIdToMintQuery = useReadContract(nextTokenIdToMint, {
    contract,
  });
  const [progress, setProgress] = useState<UploadProgressEvent>({
    progress: 0,
    total: 100,
  });

  const mintBatchMutation = useLazyMint(
    contractV4,
    (event: UploadProgressEvent) => {
      setProgress(event);
    },
  );

  const mintDelayedRevealBatchMutation = useDelayedRevealLazyMint(
    contractV4 as RevealableContract,
    (event: UploadProgressEvent) => {
      setProgress(event);
    },
  );

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
          onSubmit={async ({ revealType, data }) => {
            // nice, we can set up everything the same for both the only thing that changes is the action string
            const action = `batch-upload-${revealType}` as const;

            trackEvent({
              category: "nft",
              action,
              label: "attempt",
            });
            try {
              if (revealType === "instant") {
                // instant reveal
                await mintBatchMutation.mutateAsync(data);
              } else {
                // otherwise it's delayed reveal
                await mintDelayedRevealBatchMutation.mutateAsync({
                  metadatas: data.metadata,
                  placeholder: data.placeholderMetadata,
                  password: data.password,
                });
              }

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
            } finally {
              setProgress({
                progress: 0,
                total: 100,
              });
            }
          }}
          nextTokenIdToMint={nextTokenIdToMintQuery.data || 0n}
          isRevealable={isRevealable}
        >
          {mintBatchMutation.isLoading ? (
            <ProgressBox progress={progress} />
          ) : null}
        </BatchLazyMint>
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={RiCheckboxMultipleBlankLine} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Batch Upload
      </Button>
    </MinterOnly>
  );
};
