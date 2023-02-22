import { Box, Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { PublishedContractTable } from "components/contract-components/contract-table-v2";
import { PREBUILT_SOLANA_CONTRACTS_MAP } from "constants/mappings";
// import dynamic from "next/dynamic";
import { PageId } from "page-id";
import { Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const Programs: ThirdwebNextPage = () => {
  const prebuiltSolContracts = Object.values(PREBUILT_SOLANA_CONTRACTS_MAP);

  return (
    <Flex gap={6} direction="column">
      <Heading>Programs</Heading>
      <Text fontStyle="italic">Prebuilt solana progams for you to deploy.</Text>
      <Box id="program-table">
        <PublishedContractTable
          contractDetails={prebuiltSolContracts}
          isFetching={false}
          hidePublisher
        />
      </Box>
    </Flex>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

Programs.getLayout = (page, props) => <AppLayout {...props}>{page}</AppLayout>;

Programs.pageId = PageId.Programs;

export default Programs;
