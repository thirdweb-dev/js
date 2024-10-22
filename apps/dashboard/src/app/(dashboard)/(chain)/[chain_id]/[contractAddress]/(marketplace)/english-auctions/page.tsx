import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractEnglishAuctionsPage } from "./ContractEnglishAuctionsPage";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const info = await getContractPageParamsInfo((await props.params));

  if (!info) {
    notFound();
  }

  const { isEnglishAuctionSupported } = await getContractPageMetadata(
    info.contract,
  );

  if (!isEnglishAuctionSupported) {
    redirect(`/${(await props.params).chain_id}/${(await props.params).contractAddress}`);
  }

  return <ContractEnglishAuctionsPage contract={info.contract} />;
}
