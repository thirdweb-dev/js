import { notFound, redirect } from "next/navigation";
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

  const { clientContract, serverContract, isLocalhostChain } = info;

  const account = await getRawAccount();

  if (isLocalhostChain) {
    return (
      <ContractEditModulesPageClient
        contract={clientContract}
        isLoggedIn={!!account}
      />
    );
  }

  const { isModularCore } = await getContractPageMetadata(serverContract);

  if (!isModularCore) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractEditModulesPage contract={clientContract} isLoggedIn={!!account} />
  );
}
