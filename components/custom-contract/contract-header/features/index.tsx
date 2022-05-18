import { FeatureButton } from "./feature-button";
import { convertFeaturesMapToarray } from "./utils";
import { Icon } from "@chakra-ui/icons";
import { ButtonGroup, Center, Flex } from "@chakra-ui/react";
import { useContractPublishMetadata } from "@thirdweb-dev/react";
import { FeatureName } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import { useContractFeatures } from "components/contract-components/hooks";
import { useMemo } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Text } from "tw-components";

const EIP_FEATURE_NAMES: FeatureName[] = ["ERC20", "ERC721", "ERC1155"];

interface ContractHeaderFeaturesSectionProps {
  contractAddress: string;
}
export const ContractHeaderFeaturesSection: React.FC<
  ContractHeaderFeaturesSectionProps
> = ({ contractAddress }) => {
  const metadataQuery = useContractPublishMetadata(contractAddress);
  const contractFeatures = useContractFeatures(metadataQuery?.data?.abi);

  const enabledFeatures = useMemo(() => {
    return convertFeaturesMapToarray(contractFeatures).filter((f) => f.enabled);
  }, [contractFeatures]);

  const { eipFeatures, extensions } = useMemo(() => {
    return {
      eipFeatures: enabledFeatures.filter((f) =>
        EIP_FEATURE_NAMES.includes(f.name),
      ),
      extensions: enabledFeatures.filter(
        (f) => !EIP_FEATURE_NAMES.includes(f.name),
      ),
    };
  }, [enabledFeatures]);
  if (!enabledFeatures.length) {
    return null;
  }

  return (
    <Flex gap={4} flexDirection="row">
      <ButtonGroup variant="outline" size="sm">
        {eipFeatures.map((enabledFeature) => (
          <FeatureButton
            features={[enabledFeature]}
            rightIcon={
              <Icon boxSize={4} as={FiCheckCircle} color="green.500" />
            }
            key={enabledFeature.name}
          >
            {enabledFeature.name}
          </FeatureButton>
        ))}
        {extensions.length > 0 && (
          <FeatureButton
            features={extensions}
            rightIcon={
              <Center
                color="green.500"
                border="1px"
                boxSize={4}
                borderRadius="full"
              >
                <Text color="inherit" size="label.sm">
                  {extensions.length}
                </Text>
              </Center>
            }
          >
            Extensions
          </FeatureButton>
        )}
      </ButtonGroup>
    </Flex>
  );
};
