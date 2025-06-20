"use client";

import type { ThirdwebContract } from "thirdweb";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { ErrorPage, LoadingPage } from "../../_components/page-skeletons";
import { RedirectToContractOverview } from "../../_components/redirect-contract-overview.client";
import { useContractPageMetadata } from "../../_hooks/useContractPageMetadata";
import { ContractDirectListingsPage } from "./ContractDirectListingsPage";

export function ContractDirectListingsPageClient(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  projectMeta: ProjectMeta | undefined;
}) {
  const metadataQuery = useContractPageMetadata(props.contract);

  if (metadataQuery.isPending) {
    return <LoadingPage />;
  }

  if (metadataQuery.isError) {
    return <ErrorPage />;
  }

  if (!metadataQuery.data.isDirectListingSupported) {
    return (
      <RedirectToContractOverview
        contract={props.contract}
        projectMeta={props.projectMeta}
      />
    );
  }

  return (
    <ContractDirectListingsPage
      contract={props.contract}
      isInsightSupported={metadataQuery.data.isInsightSupported}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
