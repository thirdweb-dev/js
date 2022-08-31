import {
  Skeleton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import {
  useAddress,
  useTokenBalance,
  useTokenSupply,
} from "@thirdweb-dev/react";
import { Erc20 } from "@thirdweb-dev/sdk";
import React from "react";
import { Card } from "tw-components";

interface TokenBalancesProps {
  contract: Erc20;
}

export const TokenSupply: React.FC<TokenBalancesProps> = ({ contract }) => {
  const address = useAddress();
  const { data: tokenSupply, isSuccess: isTokenSupplySuccess } =
    useTokenSupply(contract);
  const { data: ownedBalance, isSuccess: isOwnedBalanceSuccess } =
    useTokenBalance(contract, contract.getAddress());

  return (
    <Stack spacing={6}>
      <Stack direction={{ base: "column", md: "row" }} spacing={6}>
        <Card as={Stat}>
          <StatLabel>Total Supply</StatLabel>
          <Skeleton isLoaded={isTokenSupplySuccess}>
            <StatNumber>
              {tokenSupply?.displayValue} {tokenSupply?.symbol}
            </StatNumber>
          </Skeleton>
        </Card>
        <Card as={Stat}>
          <StatLabel>Owned by you</StatLabel>
          <Skeleton isLoaded={isOwnedBalanceSuccess || !address}>
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
          </Skeleton>
        </Card>
        <Card as={Stat}>
          <StatLabel>Decimals</StatLabel>
          <Skeleton isLoaded={isTokenSupplySuccess}>
            <StatNumber>{tokenSupply?.decimals}</StatNumber>
          </Skeleton>
        </Card>
      </Stack>
    </Stack>
  );
};
