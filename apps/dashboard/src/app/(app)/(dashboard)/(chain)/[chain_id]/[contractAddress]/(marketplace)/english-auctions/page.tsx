import { getRawAccount } from "../../../../../../account/settings/getAccount";
import type { PublicContractPageParams } from "../../types";
import { SharedEnglishAuctionsPage } from "./shared-english-auctions-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  const account = await getRawAccount();
  return (
    <SharedEnglishAuctionsPage
      contractAddress={params.contractAddress}
      chainIdOrSlug={params.chain_id}
      projectMeta={undefined}
      isLoggedIn={!!account}
    />
  );
}
