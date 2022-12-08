import { Stack } from "@chakra-ui/react";
import { useBurnNFT } from "@thirdweb-dev/react/solana";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Text } from "tw-components";

interface BurnTabProps {
  program: NFTCollection | NFTDrop;
  tokenId: string;
}

const BurnTab: React.FC<BurnTabProps> = ({ program, tokenId }) => {
  const trackEvent = useTrack();

  const burn = useBurnNFT(program);

  const { onSuccess, onError } = useTxNotifications(
    "Burn successful",
    "Error burning",
  );

  return (
    <Stack pt={3} gap={3}>
      <Text>
        Burning this NFT will remove it from your wallet. The NFT data will
        continue to be accessible but no one will be able to claim ownership
        over it again. This action is irreversible.
      </Text>

      <TransactionButton
        ecosystem="solana"
        transactionCount={1}
        isLoading={burn.isLoading}
        onClick={() => {
          trackEvent({
            category: "nft",
            action: "burn",
            label: "attempt",
          });
          burn.mutate(tokenId, {
            onSuccess: () => {
              trackEvent({
                category: "nft",
                action: "burn",
                label: "success",
              });
              onSuccess();
            },
            onError: (error) => {
              trackEvent({
                category: "nft",
                action: "burn",
                label: "error",
                error,
              });
              onError(error);
            },
          });
        }}
        colorScheme="primary"
        alignSelf="flex-end"
      >
        Burn
      </TransactionButton>
    </Stack>
  );
};

export default BurnTab;
