"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractOverviewPage } from "./ContractOverviewPage";
import {
  PublishedByUI,
  getPublishedByCardProps,
} from "./components/published-by-ui";

export function ContractOverviewPageClient(props: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
}) {
  const { contract, chainMetadata } = props;
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
      hasDirectListings={contractPageMetadata.isDirectListingSupported}
      hasEnglishAuctions={contractPageMetadata.isEnglishAuctionSupported}
      isErc1155={contractPageMetadata.supportedERCs.isERC1155}
      isErc20={contractPageMetadata.supportedERCs.isERC20}
      isErc721={contractPageMetadata.supportedERCs.isERC721}
      isPermissionsEnumerable={
        contractPageMetadata.isPermissionsEnumerableSupported
      }
      chainSlug={chainMetadata.slug}
      isAnalyticsSupported={contractPageMetadata.isAnalyticsSupported}
      functionSelectors={contractPageMetadata.functionSelectors}
      // TODO
      publishedBy={<PublishedByClient contract={props.contract} />}
    />
  );
}

function PublishedByClient(props: {
  contract: ThirdwebContract;
}) {
  const client = useThirdwebClient();
  const address = useActiveAccount()?.address;
  const propsQuery = useQuery({
    queryKey: ["getPublishedByCardProps", props],
    queryFn: () =>
      getPublishedByCardProps({
        address: address || null,
        client: client,
        contract: props.contract,
      }),
  });

  if (!propsQuery.data) {
    return null;
  }

  return <PublishedByUI {...propsQuery.data} />;
}
