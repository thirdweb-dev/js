import { notFound } from "next/navigation";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractEnglishAuctionsPage } from "./ContractEnglishAuctionsPage";
import { ContractEnglishAuctionsPageClient } from "./ContractEnglishAuctionsPage.client";

export async function SharedEnglishAuctionsPage(props: {
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
      <ContractEnglishAuctionsPageClient
        contract={info.clientContract}
        isLoggedIn={props.isLoggedIn}
        projectMeta={props.projectMeta}
      />
    );
  }

  const metadata = await getContractPageMetadata(info.serverContract);

  if (!metadata.isEnglishAuctionSupported) {
    redirectToContractLandingPage({
      contractAddress: props.contractAddress,
      chainIdOrSlug: props.chainIdOrSlug,
      projectMeta: props.projectMeta,
    });
  }

  return (
    <ContractEnglishAuctionsPage
      contract={info.clientContract}
      isLoggedIn={props.isLoggedIn}
      isInsightSupported={metadata.isInsightSupported}
    />
  );
}
