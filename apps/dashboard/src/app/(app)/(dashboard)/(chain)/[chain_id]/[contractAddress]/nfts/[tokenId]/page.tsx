import { notFound, redirect } from "next/navigation";
import { getRawAccount } from "../../../../../../account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../../../../../api/lib/getAuthToken";
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

  const [accountAddress, account] = await Promise.all([
    getAuthTokenWalletAddress(),
    getRawAccount(),
  ]);

  const { clientContract, serverContract, isLocalhostChain } = info;
  if (isLocalhostChain) {
    return (
      <TokenIdPageClient
        contract={clientContract}
        tokenId={params.tokenId}
        isLoggedIn={!!account}
        accountAddress={accountAddress || undefined}
      />
    );
  }

  const { supportedERCs } = await getContractPageMetadata(serverContract);

  if (!supportedERCs.isERC721 && !supportedERCs.isERC1155) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <TokenIdPage
      contract={clientContract}
      isErc721={supportedERCs.isERC721}
      tokenId={params.tokenId}
      isLoggedIn={!!account}
      accountAddress={accountAddress || undefined}
    />
  );
}

function isOnlyNumbers(str: string) {
  return /^\d+$/.test(str);
}
