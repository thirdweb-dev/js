import { SettingsMetadata } from "./components/metadata";
// import { OnDashboard } from "./components/on-dashboard";
// import { PaperCheckoutSetting } from "./components/paper-xyz";
import { SettingsPlatformFees } from "./components/platform-fees";
import { SettingsPrimarySale } from "./components/primary-sale";
import { SettingsRoyalties } from "./components/royalties";
import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";

// import { isPaperSupportedContract } from "contract-ui/utils";
// import { useSingleQueryParam } from "hooks/useQueryParam";

interface ContractSettingsPageProps {
  contractAddress?: string;
}

export const ContractSettingsPage: React.FC<
  ContractSettingsPageProps
> = ({ contractAddress }) => {
  // TODO remove this
  // const paperEnabled = useSingleQueryParam("paper-enabled");

  const contractQuery = useContract(contractAddress);
  // const contractType = useContractType(contractAddress);

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

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={8} w="100%">
        <SimpleGrid columns={1} w="100%" gap={8}>
          <GridItem order={detectedMetadata === "enabled" ? 0 : 100}>
            <SettingsMetadata
              contract={contractQuery.contract}
              detectedState={detectedMetadata}
            />
          </GridItem>

          {/* paper.xyz settings */}
          {/* {!!paperEnabled &&
            isPaperSupportedContract(
              contractQuery.contract,
              contractType.data,
            ) && (
              <GridItem order={1}>
                <PaperCheckoutSetting contract={contractQuery.contract} />
              </GridItem>
            )} */}
          {/* end paper.xyz settings */}

          <GridItem order={detectedPrimarySale === "enabled" ? 2 : 101}>
            <SettingsPrimarySale
              contract={contractQuery.contract}
              detectedState={detectedPrimarySale}
            />
          </GridItem>

          <GridItem order={detectedRoyalties === "enabled" ? 3 : 102}>
            <SettingsRoyalties
              contract={contractQuery.contract}
              detectedState={detectedRoyalties}
            />
          </GridItem>

          <GridItem order={detectedPlatformFees === "enabled" ? 4 : 103}>
            <SettingsPlatformFees
              contract={contractQuery.contract}
              detectedState={detectedPlatformFees}
            />
          </GridItem>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};
