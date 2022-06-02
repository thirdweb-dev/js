import { SettingsMetadata } from "./components/metadata";
import { SettingsPlatformFees } from "./components/platform-fees";
import { SettingsPrimarySale } from "./components/primary-sale";
import { SettingsRoyalties } from "./components/royalties";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { PotentialContractInstance } from "contract-ui/types/types";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractSettingsTab: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const contract = useContract(contractAddress);

  const detectedMetadata = detectMetadata(contract.contract);
  const detectedPrimarySale = detectPrimarySale(contract.contract);
  const detectedRoyalties = detectRoyalties(contract.contract);
  const detectedPlatformFees = detectPlatformFees(contract.contract);

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (
    !detectedMetadata &&
    !detectedPrimarySale &&
    !detectedPlatformFees &&
    !detectedRoyalties
  ) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No Settings enabled</Heading>
        <Text>
          To enable Settings features you will have to extend the required
          interfaces in your contract.
        </Text>

        <Divider my={1} borderColor="borderColor" />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-extensions/other-settings"
            >
              Settings
            </LinkButton>
          </ButtonGroup>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%">
        <Flex flexDir="column" w="100%" gap={8}>
          {detectedMetadata && (
            <SettingsMetadata contract={contract.contract} />
          )}
          {detectedPrimarySale && (
            <SettingsPrimarySale contract={contract.contract} />
          )}
          {detectedRoyalties && (
            <SettingsRoyalties contract={contract.contract} />
          )}
          {detectedPlatformFees && (
            <SettingsPlatformFees contract={contract.contract} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export function detectMetadata(contract: PotentialContractInstance) {
  if (!contract) {
    return undefined;
  }
  if ("metadata" in contract) {
    return contract.metadata;
  }
  return undefined;
}

export function detectPrimarySale(contract: PotentialContractInstance) {
  if (!contract) {
    return undefined;
  }
  if ("sales" in contract) {
    return contract.sales;
  }
  return undefined;
}

export function detectPlatformFees(contract: PotentialContractInstance) {
  if (!contract) {
    return undefined;
  }
  if ("platformFees" in contract) {
    return contract.platformFees;
  }
  return undefined;
}

export function detectRoyalties(contract: PotentialContractInstance) {
  if (!contract) {
    return undefined;
  }
  if ("royalties" in contract) {
    return contract.royalties;
  }
  return undefined;
}
