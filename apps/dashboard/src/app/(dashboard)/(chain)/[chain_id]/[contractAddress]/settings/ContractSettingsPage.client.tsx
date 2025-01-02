"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractSettingsPage } from "./ContractSettingsPage";

export function ContractSettingsPageClient(props: {
  contract: ThirdwebContract;
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
    <ContractSettingsPage
      contract={props.contract}
      functionSelectors={metadataQuery.data.functionSelectors}
      twAccount={props.twAccount}
    />
  );
}
