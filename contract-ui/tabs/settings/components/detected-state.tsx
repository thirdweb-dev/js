import { Flex, Icon, SimpleGrid, Spinner } from "@chakra-ui/react";
import { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { FiExternalLink } from "react-icons/fi";
import { VscExtensions } from "react-icons/vsc";
import { Heading, Text, TrackedLink } from "tw-components";

const settingTypeMap = {
  metadata: {
    name: "Contract Metadata",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/ContractMetadata",
  },
  primarySale: {
    name: "Primary Sales",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/PrimarySale",
  },
  royalties: {
    name: "Royalties",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/Royalty",
  },
  platformFee: {
    name: "Platform Fee",
    portalLink:
      "https://portal.thirdweb.com/contracts/build/extensions/general/PlatformFee",
  },
} as const;

interface SettingDetectedStateProps {
  type: keyof typeof settingTypeMap;
  detectedState: ExtensionDetectedState;
}

export const SettingDetectedState: React.FC<SettingDetectedStateProps> = ({
  type,
  detectedState,
}) => {
  if (detectedState === "enabled") {
    return null;
  }

  const metadata = settingTypeMap[type];

  return (
    <SimpleGrid
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      bg="opaqueBg"
      zIndex={1}
      backdropFilter="blur(4px)"
      placeItems="center"
      px={{ base: 6, md: 0 }}
      borderRadius="md"
    >
      {detectedState === "loading" ? (
        <Spinner size="sm" />
      ) : (
        <Flex flexDir="column" gap={3}>
          <Flex align="center" gap={2}>
            <Icon as={VscExtensions} color="red.500" />
            <Heading size="subtitle.md">Missing extension</Heading>
          </Flex>
          <Text>
            This contract does not implement the required extension for{" "}
            <strong>{metadata.name}</strong>.
          </Text>
          <TrackedLink
            category="contract-settings"
            label="metadata-extension"
            href={metadata.portalLink}
            isExternal
            display="flex"
            flexDir="row"
            alignItems="center"
            gap={2}
          >
            Learn how to enable this extension
            <Icon as={FiExternalLink} size="sm" />
          </TrackedLink>
        </Flex>
      )}
    </SimpleGrid>
  );
};
