import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import type { ThirdwebContract } from "thirdweb";
import { Card, Heading, LinkButton, Text } from "tw-components";
import { ClaimConditions } from "./components/claim-conditions";

interface ContractClaimConditionsPageProps {
  contract: ThirdwebContract;
  claimconditionExtensionDetection: ExtensionDetectedState;
  isERC20: boolean;
  hasNewClaimConditions: boolean;
}

export const ContractClaimConditionsPage: React.FC<
  ContractClaimConditionsPageProps
> = ({
  contract,
  claimconditionExtensionDetection,
  isERC20,
  hasNewClaimConditions,
}) => {
  if (!claimconditionExtensionDetection) {
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
        contract={contract}
        contractInfo={{ isErc20: isERC20, hasNewClaimConditions }}
      />
    </Flex>
  );
};
