import { Box, Flex, Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useContractPublishMetadataFromURI } from "components/contract-components/hooks";
import { FeatureIconMap } from "constants/mappings";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { AiOutlineRight } from "react-icons/ai";
import { Card, Heading, Text } from "tw-components";

interface ContractCardProps {
  uri: string;
}

export const CustomContractCard: React.FC<ContractCardProps> = ({ uri }) => {
  const wallet = useSingleQueryParam("wallet");
  const contractMetadata = useContractPublishMetadataFromURI(uri);

  const contractImage =
    contractMetadata?.data?.image || FeatureIconMap["custom"];

  return (
    <LinkBox>
      <Card
        p={6}
        as={Flex}
        justifyContent="space-between"
        _hover={{ borderColor: "primary.600" }}
      >
        <Flex gap={3}>
          <Box display={{ base: "none", md: "block" }}>
            <ChakraNextImage
              src={contractImage}
              objectFit="contain"
              boxSize={6}
              alt={contractMetadata?.data?.name || ""}
            />
          </Box>
          <Flex>
            <LinkOverlay
              href={`/contracts/${wallet}/${contractMetadata.data?.name}`}
            >
              <Heading size="title.sm">{contractMetadata.data?.name}</Heading>
            </LinkOverlay>
            <Text>{contractMetadata.data?.description}</Text>
          </Flex>
        </Flex>
        <Icon as={AiOutlineRight} boxSize={6} />
      </Card>
    </LinkBox>
  );
};
