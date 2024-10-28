"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractPermissionsPage } from "./ContractPermissionsPage";

export function ContractPermissionsPageClient(props: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
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
      contract={props.contract}
      chainSlug={props.chainMetadata.slug}
      detectedPermissionEnumerable={
        metadataQuery.data.isPermissionsEnumerableSupported
      }
    />
  );
}
