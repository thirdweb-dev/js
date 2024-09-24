"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useResolveContractAbi } from "@3rdweb-sdk/react/hooks/useResolveContractAbi";
import type { ThirdwebContract } from "thirdweb";
import { CodeOverview } from "./components/code-overview";

interface ContractCodePageProps {
  contract: ThirdwebContract;
}

export const ContractCodePage: React.FC<ContractCodePageProps> = ({
  contract,
}) => {
  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const abiQuery = useResolveContractAbi(contract);

  if (abiQuery.isPending) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <CodeOverview abi={abiQuery.data} contractAddress={contract.address} />
    </div>
  );
};
