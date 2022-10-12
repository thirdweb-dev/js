import { Icon, useDisclosure } from "@chakra-ui/react";
import { useClaimConditions, useLazyMint } from "@thirdweb-dev/react/solana";
import { NFTDrop } from "@thirdweb-dev/sdk/solana";
import { UploadProgressEvent } from "@thirdweb-dev/storage";
import { BatchLazyMint } from "core-ui/batch-upload/batch-lazy-mint";
import { ProgressBox } from "core-ui/batch-upload/progress-box";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { Button, Drawer } from "tw-components";

export const NFTBatchUploadButton: React.FC<{ program: NFTDrop }> = ({
  program,
  ...restButtonProps
}) => {
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: claimConditions } = useClaimConditions(program);
  const allLazyMinted =
    claimConditions?.totalAvailableSupply === claimConditions?.lazyMintedSupply;

  const [progress, setProgress] = useState<UploadProgressEvent>({
    progress: 0,
    total: 100,
  });

  const mintBatchMutation = useLazyMint(
    program,
    (event: UploadProgressEvent) => {
      setProgress(event);
    },
  );

  const { onSuccess, onError } = useTxNotifications(
    "Batch uploaded successfully",
    "Error uploading batch",
  );

  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="full"
        onClose={onClose}
        isOpen={isOpen}
      >
        <BatchLazyMint
          ecosystem="solana"
          onSubmit={async ({ data }) => {
            trackEvent({
              category: "nft",
              action: "batch-upload-instant",
              label: "attempt",
            });
            try {
              await mintBatchMutation.mutateAsync(data);
              trackEvent({
                category: "nft",
                action: "batch-upload-instant",
                label: "success",
              });
              onSuccess();
              onClose();
            } catch (error) {
              trackEvent({
                category: "nft",
                action: "batch-upload-instant",
                label: "error",
                error,
              });
              onError(error);
            } finally {
              setProgress({
                progress: 0,
                total: 100,
              });
            }
          }}
        >
          <ProgressBox progress={progress} />
        </BatchLazyMint>
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={RiCheckboxMultipleBlankLine} />}
        {...restButtonProps}
        onClick={onOpen}
        disabled={allLazyMinted}
      >
        Batch Upload
      </Button>
    </>
  );
};
