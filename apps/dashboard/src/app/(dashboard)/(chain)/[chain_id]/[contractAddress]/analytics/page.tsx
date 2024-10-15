import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractAnalyticsPage } from "./ContractAnalyticsPage";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  const { isAnalyticsSupported } = await getContractPageMetadata(info.contract);

  if (!isAnalyticsSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractAnalyticsPage contract={info.contract} />;
}
