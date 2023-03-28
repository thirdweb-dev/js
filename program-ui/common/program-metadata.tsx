import { MetadataHeader } from "../../components/custom-contract/contract-header/metadata-header";
import { Box, Container, Flex } from "@chakra-ui/react";
import type { useProgramMetadata } from "@thirdweb-dev/react/solana";

interface ProgramMetadataProps {
  address: string;
  metadataQuery: ReturnType<typeof useProgramMetadata>;
}

export const ProgramMetadata: React.FC<ProgramMetadataProps> = ({
  address,
  metadataQuery,
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
          <MetadataHeader
            ecosystem="solana"
            isError={metadataQuery.isError}
            isLoaded={metadataQuery.isSuccess}
            data={metadataQuery.data}
            address={address}
          />
        </Flex>
      </Container>
    </Box>
  );
};
