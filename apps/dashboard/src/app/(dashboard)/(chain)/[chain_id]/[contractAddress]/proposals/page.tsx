import { notFound, redirect } from "next/navigation";
import { ContractProposalsPage } from "../../../../../../contract-ui/tabs/proposals/page";
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

  const { isVoteContract } = await getContractPageMetadata(info.contract);

  if (!isVoteContract) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractProposalsPage contract={info.contract} />;
}
