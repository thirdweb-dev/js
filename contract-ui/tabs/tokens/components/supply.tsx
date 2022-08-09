import {
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useAddress, useBalance, useTokenSupply } from "@thirdweb-dev/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import React from "react";
import { Card } from "tw-components";

interface TokenBalancesProps {
  contract: Erc20;
}

export const TokenSupply: React.FC<TokenBalancesProps> = ({ contract }) => {
  const address = useAddress();
  const { data: tokenSupply } = useTokenSupply(contract);
  const { data: ownedBalance } = useBalance(contract.getAddress());

  return (
    <Stack spacing={6}>
      <Stack direction={{ base: "column", md: "row" }} spacing={6}>
        <Card as={Stat}>
          <StatLabel>Total Supply</StatLabel>
          <StatNumber>
            {tokenSupply?.displayValue} {tokenSupply?.symbol}
          </StatNumber>
        </Card>
        <Card as={Stat}>
          <StatLabel>Owned by you</StatLabel>
          <StatNumber>
            {address ? (
              <>
                {ownedBalance?.displayValue} {ownedBalance?.symbol}
              </>
            ) : (
              <StatHelpText>
                Connect your wallet to see your balance
              </StatHelpText>
            )}
          </StatNumber>
        </Card>
        <Card as={Stat}>
          <StatLabel>Decimals</StatLabel>
          <StatNumber>{tokenSupply?.decimals}</StatNumber>
        </Card>
      </Stack>
    </Stack>
  );
};
