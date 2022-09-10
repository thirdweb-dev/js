import { SettingsMetadata } from "./components/metadata";
import { OnDashboard } from "./components/on-dashboard";
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
  const contractQuery = useContract(contractAddress);

  const detectedMetadata = extensionDetectedState({
    contractQuery,
    feature: "ContractMetadata",
  });
  const detectedPrimarySale = extensionDetectedState({
    contractQuery,
    feature: "PrimarySale",
  });
  const detectedRoyalties = extensionDetectedState({
    contractQuery,
    feature: "Royalty",
  });
  const detectedPlatformFees = extensionDetectedState({
    contractQuery,
    feature: "PlatformFee",
  });

  if (contractQuery.isLoading) {
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
      <Flex direction="column" gap={4}>
        <Card as={Flex} flexDir="column" gap={3}>
          {/* TODO  extract this out into it's own component and make it better */}
          <Heading size="subtitle.md">No Settings enabled</Heading>
          <Text>
            To enable Settings features you will have to extend the required
            interfaces in your contract.
          </Text>

          <Divider my={1} />
          <Flex gap={4} align="center">
            <Heading size="label.md">Learn more: </Heading>
            <ButtonGroup colorScheme="purple" size="sm" variant="solid">
              <LinkButton
                isExternal
                href="https://portal.thirdweb.com/extensions/features/platformfee"
              >
                Platform Fee
              </LinkButton>
              <LinkButton
                isExternal
                href="https://portal.thirdweb.com/extensions/features/primarysale"
              >
                Primary Sale
              </LinkButton>
              <LinkButton
                isExternal
                href="https://portal.thirdweb.com/extensions/features/royalty"
              >
                Royalty
              </LinkButton>
            </ButtonGroup>
          </Flex>
        </Card>
        <OnDashboard contractAddress={contractQuery.contract?.getAddress()} />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%">
        <Flex flexDir="column" w="100%" gap={8}>
          {detectedMetadata === "enabled" && (
            <SettingsMetadata contract={contractQuery.contract} />
          )}
          {detectedPrimarySale === "enabled" && (
            <SettingsPrimarySale contract={contractQuery.contract} />
          )}
          {detectedRoyalties === "enabled" && (
            <SettingsRoyalties contract={contractQuery.contract} />
          )}
          {detectedPlatformFees === "enabled" && (
            <SettingsPlatformFees contract={contractQuery.contract} />
          )}
          <OnDashboard contractAddress={contractQuery.contract?.getAddress()} />
        </Flex>
      </Flex>
    </Flex>
  );
};
