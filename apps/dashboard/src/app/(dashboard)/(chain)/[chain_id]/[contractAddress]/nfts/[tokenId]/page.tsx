import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
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

  const { contract } = info;
  const { supportedERCs } = await getContractPageMetadata(contract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  if (!isOnlyNumbers(props.params.tokenId)) {
    // redirect to nfts index page
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}/nfts`);
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
