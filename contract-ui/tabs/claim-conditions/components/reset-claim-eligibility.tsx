import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Box, Flex } from "@chakra-ui/react";
import { DropContract, useResetClaimConditions } from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { Card, Heading, Text } from "tw-components";

interface ResetClaimEligibilityProps {
  isErc20: boolean;
  contract: DropContract;
  tokenId?: string;
  isColumn?: true;
}

export const ResetClaimEligibility: React.FC<ResetClaimEligibilityProps> = ({
  contract,
  tokenId,
  isErc20,
  isColumn,
}) => {
  const trackEvent = useTrack();
  const resetClaimConditions = useResetClaimConditions(contract, tokenId);
  const txNotification = useTxNotifications(
    "Successfully reset claim eligibility",
    "Failed to reset claim eligibility",
  );

  const handleResetClaimEligibility = () => {
    const category = isErc20 ? "token" : "nft";

    trackEvent({
      category,
      action: "reset-claim-conditions",
      label: "attempt",
    });

    resetClaimConditions.mutate(undefined, {
      onSuccess: () => {
        txNotification.onSuccess();
        trackEvent({
          category,
          action: "reset-claim-conditions",
          label: "success",
        });
      },
      onError: (error) => {
        txNotification.onError(error);
        trackEvent({
          category,
          action: "reset-claim-conditions",
          label: "error",
          error,
        });
      },
    });
  };

  return (
    <Card p={0} position="relative">
      <Flex pt={{ base: 6, md: 10 }} direction="column" gap={8}>
        <Flex
          px={isColumn ? 6 : { base: 6, md: 10 }}
          as="section"
          direction="column"
          gap={4}
        >
          <Flex direction="column">
            <Heading size="title.md">Claim Eligibility</Heading>
            <Text size="body.md" fontStyle="italic" mt={2}>
              This contract&apos;s claim eligibility stores who has already
              claimed {isErc20 ? "tokens" : "NFTs"} from this contract and
              carries across claim phases. Resetting claim eligibility will
              reset this state permanently, and people who have already claimed
              to their limit will be able to claim again.
            </Text>
          </Flex>
        </Flex>

        <AdminOnly
          contract={contract as ValidContractInstance}
          fallback={<Box pb={5} />}
        >
          <TransactionButton
            colorScheme="primary"
            transactionCount={1}
            type="submit"
            isLoading={resetClaimConditions.isLoading}
            onClick={handleResetClaimEligibility}
            loadingText="Resetting..."
            size="md"
            borderRadius="xl"
            borderTopLeftRadius="0"
            borderTopRightRadius="0"
          >
            Reset Claim Eligibility
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
