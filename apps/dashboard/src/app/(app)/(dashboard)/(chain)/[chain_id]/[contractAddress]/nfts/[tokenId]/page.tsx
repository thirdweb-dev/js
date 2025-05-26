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
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      tokenId={params.tokenId}
      projectMeta={undefined}
      isLoggedIn={!!account}
    />
  );
}
