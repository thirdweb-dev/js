"use client";

import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { EmbedSetup } from "./embed-setup";

export function EmbedSetupClient(props: {
  contract: ThirdwebContract;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  if (metadataQuery.data.embedType === null) {
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return (
    <EmbedSetup
      contract={props.contract}
      ercOrMarketplace={metadataQuery.data.embedType}
    />
  );
}
