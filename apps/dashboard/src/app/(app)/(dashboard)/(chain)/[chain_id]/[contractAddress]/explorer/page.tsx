import { notFound } from "next/navigation";
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

  const { clientContract, serverContract, chainMetadata, isLocalhostChain } =
    info;

  const account = await getRawAccount();

  if (isLocalhostChain) {
    return (
      <ContractExplorerPageClient
        contract={clientContract}
        chainMetadata={chainMetadata}
        isLoggedIn={!!account}
      />
    );
  }

  const abi = await resolveContractAbi(serverContract).catch(() => undefined);

  return (
    <ContractExplorerPage
      contract={clientContract}
      abi={abi}
      chainMetadata={chainMetadata}
      isLoggedIn={!!account}
    />
  );
}
