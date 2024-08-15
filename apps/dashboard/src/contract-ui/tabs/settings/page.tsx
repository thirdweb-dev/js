import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import type { ThirdwebContract } from "thirdweb";
import { SettingsMetadata } from "./components/metadata";
import { SettingsPlatformFees } from "./components/platform-fees";
import { SettingsPrimarySale } from "./components/primary-sale";
import { SettingsRoyalties } from "./components/royalties";

interface ContractSettingsPageProps {
  contract: ThirdwebContract;
  detectedMetadata: ExtensionDetectedState;
  detectedPrimarySale: ExtensionDetectedState;
  detectedRoyalties: ExtensionDetectedState;
  detectedPlatformFees: ExtensionDetectedState;
}

export const ContractSettingsPage: React.FC<ContractSettingsPageProps> = ({
  contract,
  detectedMetadata,
  detectedPlatformFees,
  detectedPrimarySale,
  detectedRoyalties,
}) => {
  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%">
        <SimpleGrid columns={1} w="100%" gap={8}>
          {contract && (
            <GridItem order={detectedMetadata === "enabled" ? 0 : 100}>
              <SettingsMetadata
                contract={contract}
                detectedState={detectedMetadata}
              />
            </GridItem>
          )}
          {contract && (
            <GridItem order={detectedPrimarySale === "enabled" ? 2 : 101}>
              <SettingsPrimarySale
                contract={contract}
                detectedState={detectedPrimarySale}
              />
            </GridItem>
          )}

          {contract && (
            <GridItem order={detectedRoyalties === "enabled" ? 3 : 102}>
              <SettingsRoyalties
                contract={contract}
                detectedState={detectedRoyalties}
              />
            </GridItem>
          )}

          {contract && (
            <GridItem order={detectedPlatformFees === "enabled" ? 4 : 103}>
              <SettingsPlatformFees
                contract={contract}
                detectedState={detectedPlatformFees}
              />
            </GridItem>
          )}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};
