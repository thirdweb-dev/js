"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { AccountPage } from "./AccountPage";

export function AccountPageClient(props: {
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

  if (!metadataQuery.data.isAccount) {
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return (
    <AccountPage
      contract={props.contract}
      chainMetadata={props.chainMetadata}
      twAccount={props.twAccount}
    />
  );
}
