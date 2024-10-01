import { notFound, redirect } from "next/navigation";
import { ContractSplitPage } from "../../../../../../contract-ui/tabs/split/page";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";

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

  const { isSplitSupported } = await getContractPageMetadata(info.contract);

  if (!isSplitSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractSplitPage contract={info.contract} />;
}
