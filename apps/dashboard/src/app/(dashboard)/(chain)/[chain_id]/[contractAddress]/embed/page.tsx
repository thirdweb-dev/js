import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { EmbedSetup } from "./embed-setup";

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

  const { embedType } = await getContractPageMetadata(info.contract);

  if (embedType === null) {
    redirect(`/${(await props.params).chain_id}/${(await props.params).contractAddress}`);
  }

  return <EmbedSetup contract={info.contract} ercOrMarketplace={embedType} />;
}
