import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { EmbedSetupClient } from "./EmbedSetup.client";
import { EmbedSetup } from "./embed-setup";

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

  const account = await getRawAccount();

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return <EmbedSetupClient contract={contract} twAccount={account} />;
  }

  const { embedType } = await getContractPageMetadata(contract);

  if (embedType === null) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <EmbedSetup
      contract={contract}
      ercOrMarketplace={embedType}
      twAccount={account}
    />
  );
}
