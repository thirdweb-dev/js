"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractNFTPage } from "./ContractNFTPage";

export function ContractNFTPageClient(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  projectMeta: ProjectMeta | undefined;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  const { supportedERCs, functionSelectors } = metadataQuery.data;

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    return (
      <RedirectToContractOverview
        contract={props.contract}
        projectMeta={props.projectMeta}
      />
    );
  }

  return (
    <ContractNFTPage
      contract={props.contract}
      isErc721={supportedERCs.isERC721}
      functionSelectors={functionSelectors}
      isLoggedIn={props.isLoggedIn}
      projectMeta={props.projectMeta}
    />
  );
}
