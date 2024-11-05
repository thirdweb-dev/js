import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
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

  if (info.chainMetadata.chainId === localhost.id) {
    return <ContractAnalyticsPageClient contract={info.contract} />;
  }

  const { isAnalyticsSupported } = await getContractPageMetadata(info.contract);

  if (!isAnalyticsSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return <ContractAnalyticsPage contract={info.contract} />;
}
