import { notFound } from "next/navigation";
import { resolveContractAbi, type ThirdwebContract } from "thirdweb/contract";
import { type Abi, toEventSelector, toFunctionSelector } from "thirdweb/utils";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { redirectToContractLandingPage } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { shouldRenderNewPublicPage } from "../_utils/newPublicPage";
import { ContractAnalyticsPage } from "./ContractAnalyticsPage";

export async function SharedAnalyticsPage(props: {
  contractAddress: string;
  chainIdOrSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const info = await getContractPageParamsInfo({
    chainIdOrSlug: props.chainIdOrSlug,
    contractAddress: props.contractAddress,
    teamId: props.projectMeta?.teamId,
  });

  if (!info) {
    notFound();
  }

  // new public page can't show /analytics page
  if (!props.projectMeta) {
    const shouldHide = await shouldRenderNewPublicPage(info.serverContract);
    if (shouldHide) {
      redirectToContractLandingPage({
        chainIdOrSlug: props.chainIdOrSlug,
        contractAddress: props.contractAddress,
        projectMeta: props.projectMeta,
      });
    }
  }

  const [
    { eventSelectorToName, writeFnSelectorToName },
    { isInsightSupported },
  ] = await Promise.all([
    getSelectors(info.serverContract),
    getContractPageMetadata(info.serverContract),
  ]);

  if (!isInsightSupported) {
    redirectToContractLandingPage({
      chainIdOrSlug: props.chainIdOrSlug,
      contractAddress: props.contractAddress,
      projectMeta: props.projectMeta,
    });
  }

  return (
    <ContractAnalyticsPage
      contract={info.clientContract}
      eventSelectorToNameRecord={eventSelectorToName}
      writeFnSelectorToNameRecord={writeFnSelectorToName}
    />
  );
}

async function getSelectors(contract: ThirdwebContract) {
  try {
    const abi = await resolveContractAbi<Abi>(contract);
    const writeFnSelectorToName: Record<string, string> = {};
    const eventSelectorToName: Record<string, string> = {};

    for (const item of abi) {
      if (item.type === "event") {
        eventSelectorToName[toEventSelector(item)] = item.name;
      } else if (
        // if write function
        item.type === "function" &&
        item.stateMutability !== "view" &&
        item.stateMutability !== "pure"
      ) {
        writeFnSelectorToName[toFunctionSelector(item)] = item.name;
      }
    }

    return {
      eventSelectorToName,
      writeFnSelectorToName,
    };
  } catch {
    return {
      eventSelectorToName: {},
      writeFnSelectorToName: {},
    };
  }
}
