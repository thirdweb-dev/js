import { SettingsMetadata } from "./components/metadata";
import { SettingsPlatformFees } from "./components/platform-fees";
import { SettingsPrimarySale } from "./components/primary-sale";
import { SettingsRoyalties } from "./components/royalties";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractSettingsTab: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const contract = useContract(contractAddress);

  const detectedMetadata = extensionDetectedState({
    contract,
    feature: "ContractMetadata",
  });
  const detectedPrimarySale = extensionDetectedState({
    contract,
    feature: "PrimarySale",
  });
  const detectedRoyalties = extensionDetectedState({
    contract,
    feature: "Royalty",
  });
  const detectedPlatformFees = extensionDetectedState({
    contract,
    feature: "PlatformFee",
  });

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (
    detectedMetadata === "disabled" &&
    detectedPrimarySale === "disabled" &&
    detectedPlatformFees === "disabled" &&
    detectedRoyalties === "disabled"
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
          {detectedMetadata === "enabled" && (
            <SettingsMetadata contract={contract.contract} />
          )}
          {detectedPrimarySale === "enabled" && (
            <SettingsPrimarySale contract={contract.contract} />
          )}
          {detectedRoyalties === "enabled" && (
            <SettingsRoyalties contract={contract.contract} />
          )}
          {detectedPlatformFees === "enabled" && (
            <SettingsPlatformFees contract={contract.contract} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
