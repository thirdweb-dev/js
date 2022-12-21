import { ClaimConditionsForm } from "./claim-conditions-form";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Box, Divider, Flex, Stack } from "@chakra-ui/react";
import {
  DropContract,
  TokenContract,
  useResetClaimConditions,
} from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { detectFeatures } from "components/contract-components/utils";
import { UpdateNotice } from "core-ui/update-notice/update-notice";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { hasNewClaimConditions } from "lib/claimcondition-utils";
import React from "react";
import { Card, Heading, Text } from "tw-components";

export interface ClaimConditionsProps {
  contract?: DropContract;
  tokenId?: string;
  isColumn?: true;
}
export const ClaimConditions: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
}) => {
  const trackEvent = useTrack();
  const resetClaimConditions = useResetClaimConditions(contract, tokenId);
  const { onSuccess, onError } = useTxNotifications(
    "Successfully reset claim eligibility",
    "Failed to reset claim eligibility",
  );

  const isErc20 = detectFeatures<TokenContract>(contract, ["ERC20"]);

  const newClaimConditions = hasNewClaimConditions(contract);

  const nftsOrToken = isErc20 ? "tokens" : "NFTs";

  return (
    <Stack spacing={8}>
      <Card p={0} position="relative">
        <Flex pt={{ base: 6, md: 10 }} direction="column" gap={8}>
          <Flex
            px={isColumn ? 6 : { base: 6, md: 10 }}
            as="section"
            direction="column"
            gap={4}
          >
            <Flex direction="column">
              <Heading size="title.md">Set Claim Conditions</Heading>
              <Text size="body.md" fontStyle="italic">
                Control when the {nftsOrToken} get dropped, how much they cost,
                and more.
              </Text>
            </Flex>
            {newClaimConditions && (
              <UpdateNotice
                learnMoreHref="https://blog.thirdweb.com/announcing-improved-claim-conditions"
                trackingLabel="claim_conditions"
                versions={[
                  { version: "3.6.0", sdk: "react" },
                  { version: "3.6.0", sdk: "typescript" },
                ]}
              >
                Define claim conditions on a per-wallet basis and rename your
                claim phases.
              </UpdateNotice>
            )}
          </Flex>
          <Divider />
          <ClaimConditionsForm
            contract={contract}
            tokenId={tokenId}
            isColumn={isColumn}
          />
        </Flex>
      </Card>
      <AdminOnly contract={contract as ValidContractInstance}>
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
                <Text size="body.md" fontStyle="italic">
                  This contract&apos;s claim eligibility stores who has already
                  claimed {nftsOrToken} from this contract and carries across
                  claim phases. Resetting claim eligibility will reset this
                  state permanently, and people who have already claimed to
                  their limit will be able to claim again.
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
                onClick={() => {
                  trackEvent({
                    category: isErc20 ? "token" : "nft",
                    action: "reset-claim-conditions",
                    label: "attempt",
                  });
                  resetClaimConditions.mutate(undefined, {
                    onSuccess: () => {
                      trackEvent({
                        category: isErc20 ? "token" : "nft",
                        action: "reset-claim-conditions",
                        label: "success",
                      });
                      onSuccess();
                    },
                    onError: (error) => {
                      trackEvent({
                        category: isErc20 ? "token" : "nft",
                        action: "reset-claim-conditions",
                        label: "error",
                        error,
                      });
                      onError(error);
                    },
                  });
                }}
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
      </AdminOnly>
    </Stack>
  );
};

export default ClaimConditions;
