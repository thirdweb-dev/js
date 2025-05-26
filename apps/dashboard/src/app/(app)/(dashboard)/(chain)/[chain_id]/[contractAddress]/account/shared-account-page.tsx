import { notFound } from "next/navigation";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountPage } from "./AccountPage";
import { AccountPageClient } from "./AccountPage.client";

export async function SharedContractAccountPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
  isLoggedIn: boolean;
}) {
  const info = await getContractPageParamsInfo({
    contractAddress: props.contractAddress,
    chainIdOrSlug: props.chainIdOrSlug,
    teamId: props.projectMeta?.teamId,
  });

  if (!info) {
    notFound();
  }

  if (info.isLocalhostChain) {
    return (
      <AccountPageClient
        contract={info.clientContract}
        chainMetadata={info.chainMetadata}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
      />
    );
  }

  const { isAccount, isInsightSupported } = await getContractPageMetadata(
    info.serverContract,
  );

  if (!isAccount) {
    redirectToContractLandingPage({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      projectMeta: props.projectMeta,
    });
  }

  return (
    <AccountPage
      contract={info.clientContract}
      chainMetadata={info.chainMetadata}
      isLoggedIn={props.isLoggedIn}
      isInsightSupported={isInsightSupported}
      projectMeta={props.projectMeta}
    />
  );
}
