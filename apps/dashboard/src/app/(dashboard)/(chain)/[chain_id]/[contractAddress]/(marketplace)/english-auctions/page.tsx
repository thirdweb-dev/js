import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
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

  if (info.chainMetadata.chainId === localhost.id) {
    return (
      <ContractEnglishAuctionsPageClient
        contract={info.contract}
        twAccount={twAccount}
      />
    );
  }

  const { isEnglishAuctionSupported } = await getContractPageMetadata(
    info.contract,
  );

  if (!isEnglishAuctionSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractEnglishAuctionsPage
      contract={info.contract}
      twAccount={twAccount}
    />
  );
}
