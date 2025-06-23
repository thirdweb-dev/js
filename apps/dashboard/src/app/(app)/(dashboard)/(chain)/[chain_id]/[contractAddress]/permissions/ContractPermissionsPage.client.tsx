"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractPermissionsPage } from "./ContractPermissionsPage";

export function ContractPermissionsPageClient(props: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
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

  return (
    <ContractPermissionsPage
      chainSlug={props.chainMetadata.slug}
      contract={props.contract}
      detectedPermissionEnumerable={
        metadataQuery.data.isPermissionsEnumerableSupported
      }
      isLoggedIn={props.isLoggedIn}
      projectMeta={props.projectMeta}
    />
  );
}
