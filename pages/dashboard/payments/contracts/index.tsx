import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { ContractsList } from "components/payments/contracts/overview/contracts-list";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const PaymentsContracts: ThirdwebNextPage = () => {
  return (
    <Flex>
      <ContractsList />
    </Flex>
  );
};

PaymentsContracts.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="payments-contracts" />
    {page}
  </AppLayout>
);

PaymentsContracts.pageId = PageId.PaymentsContracts;

export default PaymentsContracts;
