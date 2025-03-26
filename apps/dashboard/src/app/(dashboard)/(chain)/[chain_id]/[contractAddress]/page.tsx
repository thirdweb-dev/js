import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "./_utils/getContractFromParams";
import { getContractPageMetadata } from "./_utils/getContractPageMetadata";
import { ContractOverviewPage } from "./overview/ContractOverviewPage";
import { PublishedBy } from "./overview/components/published-by.server";
import { ContractOverviewPageClient } from "./overview/contract-overview-page.client";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const info = await getContractPageParamsInfo(params);

  if (!info) {
    notFound();
  }

  const { contract, chainMetadata } = info;
  if (contract.chain.id === localhost.id) {
    return (
      <ContractOverviewPageClient
        chainMetadata={chainMetadata}
        contract={contract}
      />
    );
  }

  const contractPageMetadata = await getContractPageMetadata(contract);

  return (
    <ContractOverviewPage
      contract={contract}
      hasDirectListings={contractPageMetadata.isDirectListingSupported}
      hasEnglishAuctions={contractPageMetadata.isEnglishAuctionSupported}
      isErc1155={contractPageMetadata.supportedERCs.isERC1155}
      isErc20={contractPageMetadata.supportedERCs.isERC20}
      isErc721={contractPageMetadata.supportedERCs.isERC721}
      isPermissionsEnumerable={
        contractPageMetadata.isPermissionsEnumerableSupported
      }
      chainSlug={chainMetadata.slug}
      isAnalyticsSupported={contractPageMetadata.isInsightSupported}
      functionSelectors={contractPageMetadata.functionSelectors}
      publishedBy={
        <ErrorBoundary fallback={null}>
          <PublishedBy contract={contract} />
        </ErrorBoundary>
      }
    />
  );
}
