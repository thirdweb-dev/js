import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { resolveContractAbi } from "thirdweb/contract";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { ContractExplorerPage } from "./ContractExplorerPage";
import { ContractExplorerPageClient } from "./ContractExplorerPage.client";

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
      <ContractExplorerPageClient
        contract={contract}
        chainMetadata={chainMetadata}
        twAccount={account}
      />
    );
  }

  const abi = await resolveContractAbi(contract).catch(() => undefined);

  return (
    <ContractExplorerPage
      contract={contract}
      abi={abi}
      chainMetadata={chainMetadata}
      twAccount={account}
    />
  );
}
