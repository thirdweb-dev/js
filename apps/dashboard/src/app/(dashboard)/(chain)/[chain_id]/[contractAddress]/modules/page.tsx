import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractEditModulesPage } from "./ContractEditModulesPage";
import { ContractEditModulesPageClient } from "./ContractEditModulesPage.client";

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

  const { contract } = info;

  const account = await getRawAccount();

  if (contract.chain.id === localhost.id) {
    return (
      <ContractEditModulesPageClient contract={contract} twAccount={account} />
    );
  }

  const { isModularCore } = await getContractPageMetadata(contract);

  if (!isModularCore) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return <ContractEditModulesPage contract={contract} twAccount={account} />;
}
