"use client";

import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { AccountSigners } from "./components/account-signers";

export function AccountSignersClient(props: {
  contract: ThirdwebContract;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  if (!metadataQuery.data.isAccountPermissionsSupported) {
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return <AccountSigners contract={props.contract} />;
}
