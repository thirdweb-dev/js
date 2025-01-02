import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
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

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return <ContractNFTPageClient contract={contract} twAccount={account} />;
  }

  const { supportedERCs, functionSelectors } =
    await getContractPageMetadata(contract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractNFTPage
      contract={contract}
      isErc721={supportedERCs.isERC721}
      functionSelectors={functionSelectors}
      twAccount={account}
    />
  );
}
