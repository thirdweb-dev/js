import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ContractPublishForm } from "components/contract-components/contract-publish-form";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";

const ContractsPublishPage: ThirdwebNextPage = () => {
  const { query } = useRouter();
  const contractId = query.contractId as string | undefined;

  return (
    <Flex gap={8} direction="column">
      {contractId && <ContractPublishForm contractId={contractId} />}
    </Flex>
  );
};

ContractsPublishPage.getLayout = (page, props) => (
  <AppLayout {...props}>{page}</AppLayout>
);

ContractsPublishPage.pageId = PageId.PublishSingle;

export default ContractsPublishPage;
