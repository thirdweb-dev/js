"use client";

import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../../_components/page-skeletons";
import { RedirectToContractOverview } from "../../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../../_hooks/useContractPageMetadata";
import { TokenIdPage } from "./token-id";

export function TokenIdPageClient(props: {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
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
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return (
    <TokenIdPage
      contract={contract}
      isErc721={supportedERCs.isERC721}
      tokenId={props.tokenId}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
