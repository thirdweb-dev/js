import { notFound, redirect } from "next/navigation";
import { getRawAccount } from "../../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractEnglishAuctionsPage } from "./ContractEnglishAuctionsPage";
import { ContractEnglishAuctionsPageClient } from "./ContractEnglishAuctionsPage.client";

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

  const twAccount = await getRawAccount();

  if (info.isLocalhostChain) {
    return (
      <ContractEnglishAuctionsPageClient
        contract={info.clientContract}
        isLoggedIn={!!twAccount}
      />
    );
  }

  const { isEnglishAuctionSupported, isInsightSupported } =
    await getContractPageMetadata(info.serverContract);

  if (!isEnglishAuctionSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractEnglishAuctionsPage
      contract={info.clientContract}
      isLoggedIn={!!twAccount}
      isInsightSupported={isInsightSupported}
    />
  );
}
