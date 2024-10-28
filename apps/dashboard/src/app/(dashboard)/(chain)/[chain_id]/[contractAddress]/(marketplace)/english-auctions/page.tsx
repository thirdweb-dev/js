import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractEnglishAuctionsPage } from "./ContractEnglishAuctionsPage";
import { ContractEnglishAuctionsPageClient } from "./ContractEnglishAuctionsPage.client";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  if (info.chainMetadata.chainId === localhost.id) {
    return <ContractEnglishAuctionsPageClient contract={info.contract} />;
  }

  const { isEnglishAuctionSupported } = await getContractPageMetadata(
    info.contract,
  );

  if (!isEnglishAuctionSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractEnglishAuctionsPage contract={info.contract} />;
}
