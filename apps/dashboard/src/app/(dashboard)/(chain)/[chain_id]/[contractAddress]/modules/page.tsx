import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractEditModulesPage } from "./ContractEditModulesPage";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const info = await getContractPageParamsInfo((await props.params));

  if (!info) {
    notFound();
  }

  const { isModularCore } = await getContractPageMetadata(info.contract);

  if (!isModularCore) {
    redirect(`/${(await props.params).chain_id}/${(await props.params).contractAddress}`);
  }

  return <ContractEditModulesPage contract={info.contract} />;
}
