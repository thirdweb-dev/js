"use client";

import { useSplitBalances } from "@3rdweb-sdk/react/hooks/useSplit";
import { SimpleGrid, StatLabel, StatNumber } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { Card } from "tw-components";

interface AccountBalanceProps {
  contract: ThirdwebContract;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ contract }) => {
  const activeChain = useActiveWalletChain();
  const { data: balance } = useWalletBalance({
    address: contract.address,
    chain: activeChain,
    client: contract.client,
  });
  const balanceQuery = useSplitBalances(contract);

  return (
    <SimpleGrid spacing={{ base: 3, md: 6 }} columns={{ base: 2, md: 4 }}>
      <Card className="[&>*]:m-0">
        <StatLabel mb={{ base: 1, md: 0 }}>{balance?.symbol}</StatLabel>
        <StatNumber>{balance?.displayValue}</StatNumber>
      </Card>
      {balanceQuery?.data
        ?.filter((bl) => bl.name !== "Native Token")
        .map((bl) => (
          <Card className="[&>*]:m-0" key={bl.symbol}>
            <StatLabel mb={{ base: 1, md: 0 }}>{bl.symbol}</StatLabel>
            <StatNumber>{bl.display_balance}</StatNumber>
          </Card>
        ))}
    </SimpleGrid>
  );
};
