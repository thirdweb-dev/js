import { getRawAccount } from "../../../../../../account/settings/getAccount";
import type { PublicContractPageParams } from "../../types";
import { SharedNFTTokenPage } from "./shared-nfts-token-page";

export default async function Page(props: {
  params: Promise<
    PublicContractPageParams & {
      tokenId: string;
    }
  >;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);

  return (
    <SharedNFTTokenPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      isLoggedIn={!!account}
      projectMeta={undefined}
      tokenId={params.tokenId}
    />
  );
}
