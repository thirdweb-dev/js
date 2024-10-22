import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractProposalsPage } from "./ContractProposalsPage";

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

  const { isVoteContract } = await getContractPageMetadata(info.contract);

  if (!isVoteContract) {
    redirect(`/${(await props.params).chain_id}/${(await props.params).contractAddress}`);
  }

  return <ContractProposalsPage contract={info.contract} />;
}
