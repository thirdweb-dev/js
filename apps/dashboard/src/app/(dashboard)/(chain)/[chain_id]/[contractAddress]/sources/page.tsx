import { notFound } from "next/navigation";
import { ContractSourcesPage } from "../../../../../../contract-ui/tabs/sources/page";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";

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
