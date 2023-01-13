import { ClaimConditionsForm } from "./claim-conditions-form/index";
import { ResetClaimEligibility } from "./reset-claim-eligibility";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Divider, Flex, Stack } from "@chakra-ui/react";
import { DropContract, TokenContract } from "@thirdweb-dev/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { detectFeatures } from "components/contract-components/utils";
import { UpdateNotice } from "core-ui/update-notice/update-notice";
import { hasNewClaimConditions } from "lib/claimcondition-utils";
import React, { useMemo } from "react";
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
  const contractInfo = useMemo(() => {
    return {
      hasNewClaimConditions: hasNewClaimConditions(contract),
      isErc20: detectFeatures<TokenContract>(contract, ["ERC20"]),
    };
  }, [contract]);

  return (
    <Stack spacing={8}>
      <Card p={0} position="relative">
        <Flex pt={{ base: 6, md: 10 }} direction="column" gap={8}>
          {/* Info */}
          <Flex
            px={isColumn ? 6 : { base: 6, md: 10 }}
            as="section"
            direction="column"
            gap={4}
          >
            <Flex direction="column">
              <Heading size="title.md">Set Claim Conditions</Heading>
              <Text size="body.md" fontStyle="italic" mt={2}>
                Control when the {contractInfo.isErc20 ? "tokens" : "NFTs"} get
                dropped, how much they cost, and more.
              </Text>
            </Flex>
            {contractInfo.hasNewClaimConditions && (
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

          {/* Set Claim Conditions */}
          {contract && (
            <ClaimConditionsForm
              contract={contract}
              tokenId={tokenId}
              isColumn={isColumn}
            />
          )}
        </Flex>
      </Card>

      {/* Reset Claim Eligibility */}
      <AdminOnly contract={contract as ValidContractInstance}>
        {contract && (
          <ResetClaimEligibility
            isErc20={contractInfo.isErc20}
            contract={contract}
            isColumn={isColumn}
            tokenId={tokenId}
          />
        )}
      </AdminOnly>
    </Stack>
  );
};

export default ClaimConditions;
