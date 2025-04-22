"use client";

import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractEditModulesPage } from "./ContractEditModulesPage";

export function ContractEditModulesPageClient(props: {
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

  if (!metadataQuery.data.isModularCore) {
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return (
    <ContractEditModulesPage
      contract={props.contract}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
