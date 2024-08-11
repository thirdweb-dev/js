import { thirdwebClient } from "@/constants/client";
import { useSplitBalances } from "@3rdweb-sdk/react/hooks/useSplit";
import { SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getContract } from "thirdweb";
import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { Card } from "tw-components";

interface AccountBalanceProps {
  address: string;
  chainId: number;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({
  address,
  chainId,
}) => {
  const v5Chain = useV5DashboardChain(chainId);
  const activeChain = useActiveWalletChain();
  const { data: balance } = useWalletBalance({
    address,
    chain: activeChain,
    client: thirdwebClient,
  });
  const contract = getContract({
    address,
    chain: v5Chain,
    client: thirdwebClient,
  });
  const balanceQuery = useSplitBalances(contract);

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
