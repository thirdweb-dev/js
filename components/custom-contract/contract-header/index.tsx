import { ContractMetadata } from "./contract-metadata";
import { Box, Container, Flex } from "@chakra-ui/react";

interface ContractHeaderProps {
  contractAddress: string;
}

export const ContractHeader: React.FC<ContractHeaderProps> = ({
  contractAddress,
}) => {
  return (
    <Box
      borderBottomColor="borderColor"
      borderBottomWidth={1}
      bg="backgroundHighlight"
      w="full"
      as="aside"
      py={6}
    >
      <Container maxW="container.page">
        <Flex justify="space-between" align="center" direction="row">
          <ContractMetadata contractAddress={contractAddress} />
          <Flex gap={4} direction={{ base: "column", md: "row" }}></Flex>
        </Flex>
      </Container>
    </Box>
  );
};
