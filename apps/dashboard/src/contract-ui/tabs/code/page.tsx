"use client";

import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import type { Abi } from "@thirdweb-dev/sdk";
import { CodeOverview } from "./components/code-overview";

interface ContractCodePageProps {
  contractAddress?: string;
}

export const ContractCodePage: React.FC<ContractCodePageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);

  useIsomorphicLayoutEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!contractQuery?.contract) {
    return null;
  }

  return (
    <Flex direction="column" gap={6}>
      <CodeOverview
        abi={contractQuery.contract?.abi as Abi}
        contractAddress={contractQuery.contract?.getAddress()}
      />
    </Flex>
  );
};
