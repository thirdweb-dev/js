import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
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

  if (info.chainMetadata.chainId === localhost.id) {
    return (
      <ContractDirectListingsPageClient
        contract={info.contract}
        twAccount={account}
      />
    );
  }

  const { isDirectListingSupported } = await getContractPageMetadata(
    info.contract,
  );

  if (!isDirectListingSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ContractDirectListingsPage contract={info.contract} twAccount={account} />
  );
}
