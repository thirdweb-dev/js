import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { detectFeatures as _detectFeatures } from "components/contract-components/utils";
import { useMemo } from "react";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { ClaimConditions } from "./components/claim-conditions";

interface ContractClaimConditionsPageProps {
  contractAddress?: string;
  detectedClaimFeature: ExtensionDetectedState;
  hasNewClaimConditions: boolean;
}

export const ContractClaimConditionsPage: React.FC<
  ContractClaimConditionsPageProps
> = ({ contractAddress, detectedClaimFeature, hasNewClaimConditions }) => {
  const contractQuery = useContract(contractAddress);

  const contractInfo = useMemo(() => {
    return {
      hasNewClaimConditions,
      isErc20: _detectFeatures(contractQuery.contract, ["ERC20"]),
    };
  }, [contractQuery.contract, hasNewClaimConditions]);

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedClaimFeature) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Claim Conditions enabled</Heading>
        <Text>
          To enable Claim Conditions features you will have to extend the
          required interfaces in your contract.
        </Text>

        <Divider my={1} />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721ClaimConditions"
            >
              Claim Conditions
            </LinkButton>
          </ButtonGroup>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <ClaimConditions
        contract={contractQuery.contract}
        contractInfo={contractInfo}
      />
    </Flex>
  );
};
