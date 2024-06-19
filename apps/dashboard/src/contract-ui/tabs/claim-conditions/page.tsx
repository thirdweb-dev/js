import { ClaimConditions } from "./components/claim-conditions";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface ContractClaimConditionsPageProps {
  contractAddress?: string;
}

export const ContractClaimConditionsPage: React.FC<
  ContractClaimConditionsPageProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress);

  const detectedFeature = extensionDetectedState({
    contractQuery,
    feature: [
      // erc 721
      "ERC721ClaimPhasesV1",
      "ERC721ClaimPhasesV2",
      "ERC721ClaimConditionsV1",
      "ERC721ClaimConditionsV2",

      // erc 20
      "ERC20ClaimConditionsV1",
      "ERC20ClaimConditionsV2",
      "ERC20ClaimPhasesV1",
      "ERC20ClaimPhasesV2",
    ],
  });

  if (contractQuery.isLoading) {
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
      <ClaimConditions contract={contractQuery.contract} />
    </Flex>
  );
};
