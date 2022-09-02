import { ClaimConditions } from "./components/claim-conditions";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import React from "react";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface ContractClaimConditionsPageProps {
  contractAddress?: string;
}

export const ContractClaimConditionsPage: React.FC<
  ContractClaimConditionsPageProps
> = ({ contractAddress }) => {
  const contract = useContract(contractAddress);

  const detectedFeature = detectClaimConditions(contract?.contract);

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedFeature) {
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
              href="https://portal.thirdweb.com/extensions/"
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
      <ClaimConditions contract={contract.contract?.nft} />
    </Flex>
  );
};

export function detectClaimConditions(contract: SmartContract | null) {
  const ercContract = contract?.nft || contract?.token;

  if (!contract || !ercContract) {
    return undefined;
  }
  if ("drop" in ercContract) {
    return ercContract?.drop;
  }
  return undefined;
}
