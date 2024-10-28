import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractProposalsPage } from "./ContractProposalsPage";
import { ContractProposalsPageClient } from "./ContractProposalsPage.client";

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

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return <ContractProposalsPageClient contract={contract} />;
  }

  const { isVoteContract } = await getContractPageMetadata(contract);

  if (!isVoteContract) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractProposalsPage contract={contract} />;
}
