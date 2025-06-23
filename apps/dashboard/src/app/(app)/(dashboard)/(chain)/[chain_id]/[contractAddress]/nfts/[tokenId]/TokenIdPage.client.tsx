"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { ErrorPage, LoadingPage } from "../../_components/page-skeletons";
import { RedirectToContractOverview } from "../../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../../_hooks/useContractPageMetadata";
import { TokenIdPage } from "./token-id";

export function TokenIdPageClient(props: {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
  accountAddress: string | undefined;
  projectMeta: ProjectMeta | undefined;
}) {
  const { contract } = props;
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  const { supportedERCs } = metadataQuery.data;

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    return (
      <RedirectToContractOverview
        contract={props.contract}
        projectMeta={props.projectMeta}
      />
    );
  }

  return (
    <TokenIdPage
      accountAddress={props.accountAddress}
      contract={contract}
      isErc721={supportedERCs.isERC721}
      isLoggedIn={props.isLoggedIn}
      projectMeta={props.projectMeta}
      tokenId={props.tokenId}
    />
  );
}
