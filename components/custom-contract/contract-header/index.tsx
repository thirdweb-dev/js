import { ContractMetadata } from "./contract-metadata";
import { Box, Container, Flex } from "@chakra-ui/react";
import { PublishedBy } from "components/contract-components/shared/published-by";

interface ContractHeaderProps {
  contractAddress: string;
}

export const ContractHeader: React.FC<ContractHeaderProps> = ({
  contractAddress,
}) => {
  return (
    <Box
      borderColor="borderColor"
      borderTopWidth={1}
      borderBottomWidth={1}
      bg="backgroundHighlight"
      w="full"
      as="aside"
      py={6}
    >
      <Container maxW="container.page">
        <Flex
          justify="space-between"
          align={{ base: "inherit", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <ContractMetadata contractAddress={contractAddress} />
          <PublishedBy contractAddress={contractAddress} />
        </Flex>
      </Container>
    </Box>
  );
};
