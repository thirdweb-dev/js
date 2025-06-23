"use client";

import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractSettingsPage } from "./ContractSettingsPage";

export function ContractSettingsPageClient(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  return (
    <ContractSettingsPage
      contract={props.contract}
      functionSelectors={metadataQuery.data.functionSelectors}
      hasDefaultFeeConfig={true}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
