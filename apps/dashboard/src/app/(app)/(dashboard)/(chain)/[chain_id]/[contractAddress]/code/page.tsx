import { notFound } from "next/navigation";
import { resolveContractAbi } from "thirdweb/contract";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { ContractCodePage } from "./contract-code-page";
import { ContractCodePageClient } from "./contract-code-page.client";

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

  if (isLocalhostChain) {
    return (
      <ContractCodePageClient
        contract={clientContract}
        chainMetadata={chainMetadata}
      />
    );
  }

  const abi = await resolveContractAbi(serverContract).catch(() => undefined);

  return (
    <ContractCodePage
      abi={abi}
      contract={clientContract}
      chainMetadata={chainMetadata}
    />
  );
}
