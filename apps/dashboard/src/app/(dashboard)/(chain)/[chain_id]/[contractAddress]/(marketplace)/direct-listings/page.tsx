import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractDirectListingsPage } from "./ContractDirectListingsPage";

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

  const { isDirectListingSupported } = await getContractPageMetadata(
    info.contract,
  );

  if (!isDirectListingSupported) {
    redirect(`/${(await props.params).chain_id}/${(await props.params).contractAddress}`);
  }

  return <ContractDirectListingsPage contract={info.contract} />;
}
