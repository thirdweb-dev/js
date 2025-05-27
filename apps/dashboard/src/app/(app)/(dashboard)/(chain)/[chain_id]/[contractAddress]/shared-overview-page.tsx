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

export async function SharedContractOverviewPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const info = await getContractPageParamsInfo({
    contractAddress: props.contractAddress,
    chainIdOrSlug: props.chainIdOrSlug,
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
        projectMeta={props.projectMeta}
        chainMetadata={chainMetadata}
        contract={clientContract}
      />
    );
  }

  // for public page
  if (!props.projectMeta) {
    const renderNewPublicPage = await shouldRenderNewPublicPage(serverContract);
    if (renderNewPublicPage) {
      return (
        <RenderNewPublicContractPage
          serverContract={serverContract}
          clientContract={clientContract}
          chainMetadata={chainMetadata}
          type={renderNewPublicPage.type}
        />
      );
    }
  }

  const contractPageMetadata = await getContractPageMetadata(serverContract);

  return (
    <ContractOverviewPage
      contract={clientContract}
      projectMeta={props.projectMeta}
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
          serverContract={props.serverContract}
          clientContract={props.clientContract}
          chainMetadata={props.chainMetadata}
        />
      );
    }
    default: {
      return null;
    }
  }
}
