import { notFound } from "next/navigation";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractDirectListingsPage } from "./ContractDirectListingsPage";
import { ContractDirectListingsPageClient } from "./ContractDirectListingsPage.client";

export async function SharedDirectListingsPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
  isLoggedIn: boolean;
}) {
  const info = await getContractPageParamsInfo({
    chainIdOrSlug: props.chainIdOrSlug,
    contractAddress: props.contractAddress,
    teamId: props.projectMeta?.teamId,
  });

  if (!info) {
    notFound();
  }

  if (info.isLocalhostChain) {
    return (
      <ContractDirectListingsPageClient
        contract={info.clientContract}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
      />
    );
  }

  const { isDirectListingSupported, isInsightSupported } =
    await getContractPageMetadata(info.serverContract);

  if (!isDirectListingSupported) {
    redirectToContractLandingPage({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      projectMeta: props.projectMeta,
    });
  }

  return (
    <ContractDirectListingsPage
      contract={info.clientContract}
      isInsightSupported={isInsightSupported}
      isLoggedIn={props.isLoggedIn}
    />
  );
}
