import { Box, Flex, Image, Skeleton } from "@chakra-ui/react";
import { useContractMetadata, useContractType } from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { FeatureIconMap } from "constants/mappings";
import { useMemo } from "react";
import { AddressCopyButton, Heading, Text } from "tw-components";

interface ContractMetadataProps {
  contractAddress: string;
}

export const ContractMetadata: React.FC<ContractMetadataProps> = ({
  contractAddress,
}) => {
  const metadataQuery = useContractMetadata(contractAddress);
  const contractType = useContractType(contractAddress);

  const contractTypeImage = useMemo(() => {
    return (
      (contractType.data &&
        contractType.data !== "custom" &&
        FeatureIconMap[contractType.data]) ||
      FeatureIconMap["custom"]
    );
  }, [contractType.data]);

  if (metadataQuery.isError) {
    return <Box>Failed to load contract metadata</Box>;
  }

  return (
    <Flex align="center" gap={2}>
      <Skeleton isLoaded={metadataQuery.isSuccess}>
        {metadataQuery.data?.image ? (
          <Image
            objectFit="contain"
            boxSize="64px"
            src={metadataQuery.data.image}
            alt={metadataQuery.data?.name}
          />
        ) : contractTypeImage ? (
          <ChakraNextImage
            boxSize="64px"
            src={contractTypeImage}
            alt={metadataQuery.data?.name || ""}
          />
        ) : null}
      </Skeleton>
      <Flex direction="column" gap={1} align="flex-start">
        <Skeleton isLoaded={metadataQuery.isSuccess}>
          <Heading size="title.md">
            {metadataQuery.isSuccess
              ? metadataQuery.data?.name
              : "testing testing testing"}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={metadataQuery.isSuccess}>
          <Text size="body.md">
            {metadataQuery.isSuccess
              ? metadataQuery.data?.description
              : "foo bar baz"}
          </Text>
        </Skeleton>
        <AddressCopyButton size="xs" address={contractAddress} />
      </Flex>
    </Flex>
  );
};
