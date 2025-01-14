import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { type ThirdwebContract, resolveContractAbi } from "thirdweb/contract";
import { type Abi, toEventSelector, toFunctionSelector } from "thirdweb/utils";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractAnalyticsPage } from "./ContractAnalyticsPage";
import { ContractAnalyticsPageClient } from "./ContractAnalyticsPage.client";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const info = await getContractPageParamsInfo(params);

  if (!info) {
    notFound();
  }

  const { eventSelectorToName, writeFnSelectorToName } = await getSelectors(
    info.contract,
  );

  if (info.chainMetadata.chainId === localhost.id) {
    return (
      <ContractAnalyticsPageClient
        contract={info.contract}
        writeFnSelectorToNameRecord={writeFnSelectorToName}
        eventSelectorToNameRecord={eventSelectorToName}
      />
    );
  }

  const { isAnalyticsSupported } = await getContractPageMetadata(info.contract);

  if (!isAnalyticsSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractAnalyticsPage
      contract={info.contract}
      writeFnSelectorToNameRecord={writeFnSelectorToName}
      eventSelectorToNameRecord={eventSelectorToName}
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
      writeFnSelectorToName,
      eventSelectorToName,
    };
  } catch {
    return {
      writeFnSelectorToName: {},
      eventSelectorToName: {},
    };
  }
}
