import {
  Skeleton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { CurrencyValue } from "@thirdweb-dev/sdk/evm";
import { Card } from "tw-components";

interface TokenSupplyLayoutProps {
  isTokenSupplySuccess: boolean;
  tokenSupply: CurrencyValue | undefined;
  isOwnedBalanceSuccess: boolean;
  address: string | undefined;
  ownedBalance: CurrencyValue | undefined;
}

export const TokenSupplyLayout: React.FC<TokenSupplyLayoutProps> = ({
  isTokenSupplySuccess,
  tokenSupply,
  isOwnedBalanceSuccess,
  address,
  ownedBalance,
}) => {
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
