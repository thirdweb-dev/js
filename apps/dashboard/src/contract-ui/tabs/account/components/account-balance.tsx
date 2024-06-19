import { useBalanceForAddress } from "@3rdweb-sdk/react/hooks/useBalanceForAddress";
import { useSplitBalances } from "@3rdweb-sdk/react/hooks/useSplit";
import { SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { Card } from "tw-components";

interface AccountBalanceProps {
  address: string;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ address }) => {
  const { data: balance } = useBalanceForAddress(address);

  const balanceQuery = useSplitBalances(address);

  return (
    <SimpleGrid spacing={{ base: 3, md: 6 }} columns={{ base: 2, md: 4 }}>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>{balance?.symbol}</StatLabel>
        <StatNumber>{balance?.displayValue}</StatNumber>
      </Card>
      {balanceQuery?.data
        ?.filter((bl) => bl.name !== "Native Token")
        .map((bl) => (
          <Card as={Stat} key={bl.symbol}>
            <StatLabel mb={{ base: 1, md: 0 }}>{bl.symbol}</StatLabel>
            <StatNumber>{bl.display_balance}</StatNumber>
          </Card>
        ))}
    </SimpleGrid>
  );
};
