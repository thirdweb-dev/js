"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractPermissionsPage } from "./ContractPermissionsPage";

export function ContractPermissionsPageClient(props: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  twAccount: Account | undefined;
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
      twAccount={props.twAccount}
      detectedPermissionEnumerable={
        metadataQuery.data.isPermissionsEnumerableSupported
      }
    />
  );
}
