"use client";

import type { ThirdwebContract } from "thirdweb";
import { ErrorPage, LoadingPage } from "../_components/page-skeletons";
import { RedirectToContractOverview } from "../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../_hooks/useContractPageMetadata";
import { ContractAnalyticsPage } from "./ContractAnalyticsPage";

export function ContractAnalyticsPageClient(props: {
  contract: ThirdwebContract;
  writeFnSelectorToNameRecord: Record<string, string>;
  eventSelectorToNameRecord: Record<string, string>;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  if (!metadataQuery.data.isAnalyticsSupported) {
    return <RedirectToContractOverview contract={props.contract} />;
  }

  return (
    <ContractAnalyticsPage
      contract={props.contract}
      writeFnSelectorToNameRecord={props.writeFnSelectorToNameRecord}
      eventSelectorToNameRecord={props.eventSelectorToNameRecord}
    />
  );
}
