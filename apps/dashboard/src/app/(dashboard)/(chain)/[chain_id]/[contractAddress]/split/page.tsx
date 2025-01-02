import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractSplitPage } from "./ContractSplitPage";
import { ContractSplitPageClient } from "./ContractSplitPage.client";

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

  const twAccount = await getRawAccount();

  if (contract.chain.id === localhost.id) {
    return (
      <ContractSplitPageClient contract={contract} twAccount={twAccount} />
    );
  }

  const { isSplitSupported } = await getContractPageMetadata(contract);

  if (!isSplitSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return <ContractSplitPage contract={contract} twAccount={twAccount} />;
}
