import { notFound } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { ContractSourcesPage } from "./ContractSourcesPage";

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

  return <ContractSourcesPage contract={info.contract} />;
}
