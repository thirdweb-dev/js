import { notFound, redirect } from "next/navigation";
import { getRawAccount } from "../../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../../_utils/getContractFromParams";
import { getContractPageMetadata } from "../../_utils/getContractPageMetadata";
import { ContractDirectListingsPage } from "./ContractDirectListingsPage";
import { ContractDirectListingsPageClient } from "./ContractDirectListingsPage.client";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const account = await getRawAccount();
  const info = await getContractPageParamsInfo(params);

  if (!info) {
    notFound();
  }

  if (info.isLocalhostChain) {
    return (
      <ContractDirectListingsPageClient
        contract={info.clientContract}
        isLoggedIn={!!account}
      />
    );
  }

  const { isDirectListingSupported, isInsightSupported } =
    await getContractPageMetadata(info.serverContract);

  if (!isDirectListingSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractDirectListingsPage
      contract={info.clientContract}
      isLoggedIn={!!account}
      isInsightSupported={isInsightSupported}
    />
  );
}
