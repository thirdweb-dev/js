import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ContractReleaseForm } from "components/contract-components/contract-release-form";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useSingleQueryParam } from "hooks/useQueryParam";
// import dynamic from "next/dynamic";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const ContractsPublishPage: ThirdwebNextPage = () => {
  const contractId = useSingleQueryParam("contractId");

  return (
    <>
      <Flex gap={8} direction="column">
        {contractId && <ContractReleaseForm contractId={contractId} />}
      </Flex>
    </>
  );
};

ContractsPublishPage.getLayout = (page, props) => (
  <AppLayout {...props}>
    <PublisherSDKContext>{page}</PublisherSDKContext>
  </AppLayout>
);

ContractsPublishPage.pageId = PageId.ReleaseSingle;

export default ContractsPublishPage;
