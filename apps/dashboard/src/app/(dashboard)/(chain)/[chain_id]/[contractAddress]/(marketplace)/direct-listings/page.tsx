import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractDirectListingsPage } from "./ContractDirectListingsPage";
import { ContractDirectListingsPageClient } from "./ContractDirectListingsPage.client";

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
    return <ContractDirectListingsPageClient contract={info.contract} />;
  }

  const { isDirectListingSupported } = await getContractPageMetadata(
    info.contract,
  );

  if (!isDirectListingSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return <ContractDirectListingsPage contract={info.contract} />;
}
