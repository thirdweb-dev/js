import { getRawAccount } from "@/api/account/get-account";
import type { PublicContractPageParams } from "../../types";
import { SharedEnglishAuctionsPage } from "./shared-english-auctions-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const [params, account] = await Promise.all([props.params, getRawAccount()]);

  return (
    <SharedEnglishAuctionsPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      isLoggedIn={!!account}
      projectMeta={undefined}
    />
  );
}
