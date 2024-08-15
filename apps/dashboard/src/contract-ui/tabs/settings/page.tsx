import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { extensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getContract } from "thirdweb";
import { SettingsMetadata } from "./components/metadata";
import { SettingsPlatformFees } from "./components/platform-fees";
import { SettingsPrimarySale } from "./components/primary-sale";
import { SettingsRoyalties } from "./components/royalties";

interface ContractSettingsPageProps {
  contractAddress?: string;
}

export const ContractSettingsPage: React.FC<ContractSettingsPageProps> = ({
  contractAddress,
}) => {
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

  const chain = useV5DashboardChain(contractQuery.contract?.chainId);

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  const contract =
    contractQuery.contract && chain
      ? getContract({
          address: contractQuery.contract.getAddress(),
          chain,
          client: thirdwebClient,
        })
      : null;

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
