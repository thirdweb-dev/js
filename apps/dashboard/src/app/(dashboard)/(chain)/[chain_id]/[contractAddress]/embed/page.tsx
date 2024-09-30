import { notFound, redirect } from "next/navigation";
import { EmbedSetup } from "../../../../../../contract-ui/tabs/embed/components/embed-setup";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";

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

  const { embedType } = await getContractPageMetadata(info.contract);

  if (embedType === null) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <EmbedSetup contract={info.contract} ercOrMarketplace={embedType} />;
}
