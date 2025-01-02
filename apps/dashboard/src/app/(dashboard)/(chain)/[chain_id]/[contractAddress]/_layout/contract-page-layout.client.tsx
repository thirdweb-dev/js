"use client";

import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { getContractPageSidebarLinks } from "../_utils/getContractPageSidebarLinks";
import { getContractMetadataHeaderData } from "./contract-metadata";
import { ContractPageLayout } from "./contract-page-layout";

export function ContractPageLayoutClient(props: {
  chainMetadata: ChainMetadata;
  contract: ThirdwebContract;
  children: React.ReactNode;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);
  const headerMetadataQuery = useQuery({
    queryKey: ["getContractMetadataHeaderData", props.contract],
    queryFn: async () => {
      return await getContractMetadataHeaderData(props.contract);
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  const sidebarLinks = getContractPageSidebarLinks({
    chainSlug: props.chainMetadata.slug,
    contractAddress: props.contract.address,
    metadata: metadataQuery.data,
  });

  return (
    <ContractPageLayout
      {...props}
      sidebarLinks={sidebarLinks}
      dashboardContractMetadata={headerMetadataQuery.data?.contractMetadata}
      externalLinks={headerMetadataQuery.data?.externalLinks}
    />
  );
}
