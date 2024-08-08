import { thirdwebClient } from "@/constants/client";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { Icon, useDisclosure } from "@chakra-ui/react";
import {
  type RevealableContract,
  type useContract,
  useDelayedRevealLazyMint,
  useLazyMint,
  useTotalCount,
} from "@thirdweb-dev/react";
import type { UploadProgressEvent } from "@thirdweb-dev/sdk";
import { BatchLazyMint } from "core-ui/batch-upload/batch-lazy-mint";
import { ProgressBox } from "core-ui/batch-upload/progress-box";
import { BigNumber } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useState } from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { getContract } from "thirdweb";
import { Button, Drawer } from "tw-components";

interface BatchLazyMintButtonProps {
  contractQuery: ReturnType<typeof useContract>;
  isRevealable: boolean;
}

export const BatchLazyMintButton: React.FC<BatchLazyMintButtonProps> = ({
  contractQuery,
  isRevealable,
  ...restButtonProps
}) => {
  const contractV4 = contractQuery.contract;
  const chain = useV5DashboardChain(contractV4?.chainId);
  const contract =
    contractV4 && chain
      ? getContract({
          address: contractV4.getAddress(),
          chain: chain,
          client: thirdwebClient,
        })
      : null;
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nextTokenIdToMint = useTotalCount(contractV4);
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
