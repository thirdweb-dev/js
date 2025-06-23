"use client";

import type { ChainMetadata } from "thirdweb/chains";
import type { ThirdwebContract } from "thirdweb/contract";
import { LoadingPage } from "../_components/page-skeletons";
import { useResolveContractABI } from "../_hooks/useResolveContractABI";
import { ContractCodePage } from "./contract-code-page";

export function ContractCodePageClient(props: {
  contract: ThirdwebContract;
  chainMetadata: ChainMetadata;
}) {
  const abiQuery = useResolveContractABI(props.contract);

  if (abiQuery.isPending) {
    return <LoadingPage />;
  }

  return (
    <ContractCodePage
      abi={abiQuery.data}
      chainMetadata={props.chainMetadata}
      contract={props.contract}
    />
  );
}
