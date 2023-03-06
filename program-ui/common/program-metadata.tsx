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
  programQuery: ReturnType<typeof useProgram>;
  metadataQuery: ReturnType<typeof useProgramMetadata>;
}

export const ProgramMetadata: React.FC<ProgramMetadataProps> = ({
  address,
  programQuery,
  metadataQuery,
}) => {
  const contractTypeImage = useMemo(() => {
    return programQuery.data
      ? PREBUILT_SOLANA_CONTRACTS_MAP[programQuery.data.accountType].icon
      : FeatureIconMap["custom"];
  }, [programQuery.data]);

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
            contractTypeImage={contractTypeImage}
          />
        </Flex>
      </Container>
    </Box>
  );
};
