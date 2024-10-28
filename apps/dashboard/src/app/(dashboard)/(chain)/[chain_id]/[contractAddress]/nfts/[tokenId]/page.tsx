import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { TokenIdPageClient } from "./TokenIdPage.client";
import { TokenIdPage } from "./token-id";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
    tokenId: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  if (!isOnlyNumbers(props.params.tokenId)) {
    // redirect to nfts index page
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}/nfts`);
  }

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return (
      <TokenIdPageClient contract={contract} tokenId={props.params.tokenId} />
    );
  }

  const { supportedERCs } = await getContractPageMetadata(contract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return (
    <TokenIdPage
      contract={contract}
      isErc721={supportedERCs.isERC721}
      tokenId={props.params.tokenId}
    />
  );
}

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}
