import { notFound, redirect } from "next/navigation";
import { ContractEditModulesPage } from "../../../../../../contract-ui/tabs/manage/page";
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

  const { isModularCore } = await getContractPageMetadata(info.contract);

  if (!isModularCore) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractEditModulesPage contract={info.contract} />;
}
