import { notFound } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { ContractSourcesPage } from "./ContractSourcesPage";

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

  return <ContractSourcesPage contract={info.contract} />;
}
