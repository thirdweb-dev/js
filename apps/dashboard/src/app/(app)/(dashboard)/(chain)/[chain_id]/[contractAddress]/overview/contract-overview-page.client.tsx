"use client";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractOverviewPage } from "./ContractOverviewPage";

export function ContractOverviewPageClient(props: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  projectMeta: ProjectMeta | undefined;
}) {
  const { contract, chainMetadata, projectMeta } = props;
  const metadataQuery = useContractPageMetadata(contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  const contractPageMetadata = metadataQuery.data;

  return (
    <ContractOverviewPage
      contract={contract}
      projectMeta={projectMeta}
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
      // TODO - create a fully client rendered version of publishedBy and ContractCard and plug it here
      publishedBy={undefined}
    />
  );
}
