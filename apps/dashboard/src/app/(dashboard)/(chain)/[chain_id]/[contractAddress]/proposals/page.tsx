import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractProposalsPage } from "./ContractProposalsPage";
import { ContractProposalsPageClient } from "./ContractProposalsPage.client";

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
  const account = await getRawAccount();

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return (
      <ContractProposalsPageClient contract={contract} twAccount={account} />
    );
  }

  const { isVoteContract } = await getContractPageMetadata(contract);

  if (!isVoteContract) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return <ContractProposalsPage contract={contract} twAccount={account} />;
}
