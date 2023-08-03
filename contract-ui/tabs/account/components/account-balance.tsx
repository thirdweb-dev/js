import { SimpleGrid, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useSDK } from "@thirdweb-dev/react";
import { CurrencyValue } from "@thirdweb-dev/sdk/evm";
import React, { useEffect, useState } from "react";
import { Card } from "tw-components";

interface AccountBalanceProps {
  address: string;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ address }) => {
  const sdk = useSDK();
  const [balance, setBalance] = useState<CurrencyValue>();

  useEffect(() => {
    const getBalance = async () => {
      const bl = await sdk?.getBalance(address);

      setBalance(bl);
    };

    getBalance();
  }, [address, sdk]);

  return (
    <SimpleGrid spacing={{ base: 3, md: 6 }} columns={{ base: 1, md: 3 }}>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>{balance?.symbol}</StatLabel>
        <StatNumber>{balance?.displayValue}</StatNumber>
      </Card>
    </SimpleGrid>
  );
};
