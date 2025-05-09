import { notFound, redirect } from "next/navigation";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractNFTPage } from "./ContractNFTPage";
import { ContractNFTPageClient } from "./ContractNFTPage.client";

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
      <ContractNFTPageClient contract={clientContract} isLoggedIn={!!account} />
    );
  }

  const { supportedERCs, functionSelectors } =
    await getContractPageMetadata(serverContract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractNFTPage
      contract={clientContract}
      isErc721={supportedERCs.isERC721}
      functionSelectors={functionSelectors}
      isLoggedIn={!!account}
    />
  );
}
