import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountPage } from "./AccountPage";
import { AccountPageClient } from "./AccountPage.client";

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

  const { contract, chainMetadata } = info;

  const account = await getRawAccount();

  if (contract.chain.id === localhost.id) {
    return (
      <AccountPageClient
        contract={contract}
        chainMetadata={chainMetadata}
        twAccount={account}
      />
    );
  }

  const { isAccount } = await getContractPageMetadata(contract);

  if (!isAccount) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <AccountPage
      contract={contract}
      chainMetadata={chainMetadata}
      twAccount={account}
    />
  );
}
