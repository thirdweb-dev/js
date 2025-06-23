import { notFound } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { ProjectMeta } from "../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { getContractPageParamsInfo } from "./_utils/getContractFromParams";
import { getContractPageMetadata } from "./_utils/getContractPageMetadata";
import {
  type NewPublicPageType,
  shouldRenderNewPublicPage,
} from "./_utils/newPublicPage";
import { ContractOverviewPage } from "./overview/ContractOverviewPage";
import { PublishedBy } from "./overview/components/published-by.server";
import { ContractOverviewPageClient } from "./overview/contract-overview-page.client";
import { ERC20PublicPage } from "./public-pages/erc20/erc20";
import { NFTPublicPage } from "./public-pages/nft/nft-page";

export async function SharedContractOverviewPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const info = await getContractPageParamsInfo({
    chainIdOrSlug: props.chainIdOrSlug,
    contractAddress: props.contractAddress,
    teamId: props.projectMeta?.teamId,
  });

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
        projectMeta={props.projectMeta}
      />
    );
  }

  // for public page
  if (!props.projectMeta) {
    const renderNewPublicPage = await shouldRenderNewPublicPage(serverContract);
    if (renderNewPublicPage) {
      return (
        <RenderNewPublicContractPage
          chainMetadata={chainMetadata}
          clientContract={clientContract}
          serverContract={serverContract}
          type={renderNewPublicPage.type}
        />
      );
    }
  }

  const contractPageMetadata = await getContractPageMetadata(serverContract);

  return (
    <ContractOverviewPage
      chainSlug={chainMetadata.slug}
      contract={clientContract}
      functionSelectors={contractPageMetadata.functionSelectors}
      hasDirectListings={contractPageMetadata.isDirectListingSupported}
      hasEnglishAuctions={contractPageMetadata.isEnglishAuctionSupported}
      isAnalyticsSupported={contractPageMetadata.isInsightSupported}
      isErc20={contractPageMetadata.supportedERCs.isERC20}
      isErc721={contractPageMetadata.supportedERCs.isERC721}
      isErc1155={contractPageMetadata.supportedERCs.isERC1155}
      isPermissionsEnumerable={
        contractPageMetadata.isPermissionsEnumerableSupported
      }
      projectMeta={props.projectMeta}
      publishedBy={
        <ErrorBoundary fallback={null}>
          <PublishedBy contract={serverContract} />
        </ErrorBoundary>
      }
    />
  );
}

function RenderNewPublicContractPage(props: {
  serverContract: ThirdwebContract;
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  type: NewPublicPageType;
}) {
  switch (props.type) {
    case "erc20": {
      return (
        <ERC20PublicPage
          chainMetadata={props.chainMetadata}
          clientContract={props.clientContract}
          serverContract={props.serverContract}
        />
      );
    }

    case "erc1155":
    case "erc721": {
      return (
        <NFTPublicPage
          chainMetadata={props.chainMetadata}
          clientContract={props.clientContract}
          serverContract={props.serverContract}
          tokenId={undefined}
          type={props.type}
        />
      );
    }

    default: {
      return null;
    }
  }
}
