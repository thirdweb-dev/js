import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
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

  const { clientContract, serverContract, chainMetadata, isLocalhostChain } =
    info;
  if (isLocalhostChain) {
    return (
      <ContractOverviewPageClient
        chainMetadata={chainMetadata}
        contract={clientContract}
      />
    );
  }

  const contractPageMetadata = await getContractPageMetadata(serverContract);

  return (
    <ContractOverviewPage
      contract={clientContract}
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
          <PublishedBy contract={serverContract} />
        </ErrorBoundary>
      }
    />
  );
}
