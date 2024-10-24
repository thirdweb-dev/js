import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
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

  const { contract, chainMetadata } = info;

  if (contract.chain.id === localhost.id) {
    return (
      <ContractCodePageClient
        contract={contract}
        chainMetadata={chainMetadata}
      />
    );
  }

  const abi = await resolveContractAbi(contract).catch(() => undefined);

  return (
    <ContractCodePage
      abi={abi}
      contract={contract}
      chainMetadata={chainMetadata}
    />
  );
}
