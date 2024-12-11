import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getRawAccount } from "../../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { TokenIdPageClient } from "./TokenIdPage.client";
import { TokenIdPage } from "./token-id";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
    tokenId: string;
  }>;
}) {
  const params = await props.params;
  const info = await getContractPageParamsInfo(params);
  if (!info) {
    notFound();
  }

  if (!isOnlyNumbers(params.tokenId)) {
    // redirect to nfts index page
    redirect(`/${params.chain_id}/${params.contractAddress}/nfts`);
  }

  const account = await getRawAccount();

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return (
      <TokenIdPageClient
        contract={contract}
        tokenId={params.tokenId}
        twAccount={account}
      />
    );
  }

  const { supportedERCs } = await getContractPageMetadata(contract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <TokenIdPage
      contract={contract}
      isErc721={supportedERCs.isERC721}
      tokenId={params.tokenId}
      twAccount={account}
    />
  );
}

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}
