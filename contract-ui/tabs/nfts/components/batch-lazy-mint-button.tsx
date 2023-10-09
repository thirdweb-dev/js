import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  RevealableContract,
  useContract,
  useDelayedRevealLazyMint,
  useLazyMint,
  useTotalCount,
} from "@thirdweb-dev/react";
import { UploadProgressEvent } from "@thirdweb-dev/sdk";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { detectFeatures } from "components/contract-components/utils";
import { BatchLazyMint } from "core-ui/batch-upload/batch-lazy-mint";
import { ProgressBox } from "core-ui/batch-upload/progress-box";
import { BigNumber } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { Button, Drawer } from "tw-components";

interface BatchLazyMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const BatchLazyMintButton: React.FC<BatchLazyMintButtonProps> = ({
  contractQuery,
  ...restButtonProps
}) => {
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nextTokenIdToMint = useTotalCount(contractQuery.contract);
  const [progress, setProgress] = useState<UploadProgressEvent>({
    progress: 0,
    total: 100,
  });

  const detectedState = extensionDetectedState({
    contractQuery,
    feature: [
      "ERC721LazyMintable",
      "ERC1155LazyMintableV1",
      "ERC1155LazyMintableV2",
    ],
  });

  const isRevealable = detectFeatures(contractQuery.contract, [
    "ERC721Revealable",
    "ERC1155Revealable",
  ]);

  const mintBatchMutation = useLazyMint(
    contractQuery.contract,
    (event: UploadProgressEvent) => {
      setProgress(event);
    },
  );

  const mintDelayedRevealBatchMutation = useDelayedRevealLazyMint(
    contractQuery.contract as RevealableContract,
    (event: UploadProgressEvent) => {
      setProgress(event);
    },
  );

  const txNotifications = useTxNotifications(
    "Batch uploaded successfully",
    "Error uploading batch",
  );

  if (detectedState !== "enabled") {
    return null;
  }

  return (
    <MinterOnly contract={contractQuery?.contract}>
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
                await mintDelayedRevealBatchMutation.mutateAsync(data);
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
          nextTokenIdToMint={BigNumber.from(
            nextTokenIdToMint.data || 0,
          ).toNumber()}
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
