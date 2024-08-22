"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { useResolveContractAbi } from "@3rdweb-sdk/react/hooks/useResolveContractAbi";
import { Flex } from "@chakra-ui/react";
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

  if (abiQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      <CodeOverview abi={abiQuery.data} contractAddress={contract.address} />
    </Flex>
  );
};
