import { notFound, redirect } from "next/navigation";
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

  const { clientContract, serverContract, isLocalhostChain } = info;
  if (isLocalhostChain) {
    return (
      <ContractProposalsPageClient
        contract={clientContract}
        isLoggedIn={!!account}
      />
    );
  }

  const { isVoteContract } = await getContractPageMetadata(serverContract);

  if (!isVoteContract) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractProposalsPage contract={clientContract} isLoggedIn={!!account} />
  );
}
