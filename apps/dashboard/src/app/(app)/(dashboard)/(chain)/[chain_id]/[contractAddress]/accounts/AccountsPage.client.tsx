"use client";

import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { AccountsPage } from "./AccountsPage";

export function AccountsPageClient(props: {
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

  if (!metadataQuery.data.isAccountFactory) {
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return (
    <AccountsPage contract={props.contract} isLoggedIn={props.isLoggedIn} />
  );
}
