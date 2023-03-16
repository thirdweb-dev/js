import { ContractMetadata } from "./contract-metadata";
import { Box, Container, Flex } from "@chakra-ui/react";
import { PrimaryDashboardButton } from "contract-ui/components/primary-dashboard-button";

interface ContractHeaderProps {
  contractAddress: string;
}

export const ContractHeader: React.FC<ContractHeaderProps> = ({
  contractAddress,
}) => {
  return (
    <Box borderColor="borderColor" borderBottomWidth={1} w="full" pb={8}>
      <Container maxW="container.page">
        <Flex
          justify="space-between"
          align={{ base: "inherit", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <ContractMetadata contractAddress={contractAddress} />
          <PrimaryDashboardButton contractAddress={contractAddress} />
        </Flex>
      </Container>
    </Box>
  );
};
