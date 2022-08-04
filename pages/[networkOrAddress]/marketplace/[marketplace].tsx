import { useContractMetadata } from "@3rdweb-sdk/react";
import { useMarketplace } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { ListButton } from "components/contract-pages/action-buttons/ListButton";
import { ContractLayout } from "components/contract-pages/contract-layout";
import { ContractItemsTable } from "components/contract-pages/table";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import React, { ReactElement } from "react";

const MarketplacePage: ThirdwebNextPage = () => {
  const marketAddress = useSingleQueryParam("marketplace");
  const contract = useMarketplace(marketAddress);
  const metadata = useContractMetadata(contract);
  return (
    <ContractLayout
      contract={contract}
      metadata={metadata}
      primaryAction={<ListButton contract={contract} />}
    >
      <ContractItemsTable
        contract={contract}
        emptyState={{ title: "You have not created any listings yet." }}
      />
    </ContractLayout>
  );
};

MarketplacePage.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);

MarketplacePage.pageId = PageId.MarketplaceContract;

export default MarketplacePage;
