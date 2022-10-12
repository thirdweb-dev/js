import { MetadataHeader } from "../../components/custom-contract/contract-header/metadata-header";
import { Box, Container, Flex } from "@chakra-ui/react";
import { useProgram, useProgramMetadata } from "@thirdweb-dev/react/solana";
import {
  FeatureIconMap,
  PREBUILT_SOLANA_CONTRACTS_MAP,
} from "constants/mappings";
import { useMemo } from "react";

interface ProgramMetadataProps {
  address: string;
}

export const ProgramMetadata: React.FC<ProgramMetadataProps> = ({
  address,
}) => {
  const programQuery = useProgram(address);
  const metadataQuery = useProgramMetadata(programQuery.data);

  const contractTypeImage = useMemo(() => {
    return programQuery.data
      ? PREBUILT_SOLANA_CONTRACTS_MAP[programQuery.data.accountType].icon
      : FeatureIconMap["custom"];
  }, [programQuery.data]);

  if (metadataQuery.isError) {
    return <Box>Failed to load program metadata</Box>;
  }
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
          <MetadataHeader
            isLoaded={metadataQuery.isSuccess}
            data={metadataQuery.data}
            address={address}
            contractTypeImage={contractTypeImage}
          />
        </Flex>
      </Container>
    </Box>
  );
};
