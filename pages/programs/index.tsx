import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ReleasedContractTable } from "components/contract-components/contract-table-v2";
import { PREBUILT_SOLANA_CONTRACTS_MAP } from "constants/mappings";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import { ReactElement } from "react";
import { Heading, Text } from "tw-components";

const Programs: ThirdwebNextPage = () => {
  const prebuiltSolContracts = Object.values(PREBUILT_SOLANA_CONTRACTS_MAP);

  return (
    <>
      <Flex gap={6} direction="column">
        <Heading>Programs</Heading>
        <Text fontStyle="italic">
          Prebuilt solana progams for you to deploy.
        </Text>
        <ReleasedContractTable
          contractDetails={prebuiltSolContracts}
          isFetching={false}
          hideReleasedBy
        />
      </Flex>
    </>
  );
};

Programs.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

Programs.pageId = PageId.Contracts;

export default Programs;
