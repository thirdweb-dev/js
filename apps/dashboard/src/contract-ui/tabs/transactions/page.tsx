import { Flex } from "@chakra-ui/react";
import { useLayoutEffect } from "react";
import { TransactionsFeed } from "./components/transactions-feed";

interface ContractTransactionsPageProps {
  contractAddress?: string;
}

export const ContractTransactionsPage: React.FC<
  ContractTransactionsPageProps
> = ({ contractAddress }) => {
  useLayoutEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!contractAddress) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      <TransactionsFeed contractAddress={contractAddress} />
    </Flex>
  );
};
