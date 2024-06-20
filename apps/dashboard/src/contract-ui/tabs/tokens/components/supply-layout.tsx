import {
  Skeleton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { CurrencyValue } from "@thirdweb-dev/sdk/evm/";
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
    <Stack spacing={{ base: 3, md: 6 }} direction="row">
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Total Supply</StatLabel>
        <Skeleton isLoaded={isTokenSupplySuccess}>
          <StatNumber>
            {tokenSupply?.displayValue} {tokenSupply?.symbol}
          </StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Owned by you</StatLabel>
        <Skeleton isLoaded={isOwnedBalanceSuccess || !address}>
          <StatNumber>
            {address ? (
              <>
                {ownedBalance?.displayValue} {ownedBalance?.symbol}
              </>
            ) : (
              <StatHelpText as="span">
                Connect your wallet to see your balance
              </StatHelpText>
            )}
          </StatNumber>
        </Skeleton>
      </Card>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>Decimals</StatLabel>
        <Skeleton isLoaded={isTokenSupplySuccess}>
          <StatNumber>{tokenSupply?.decimals}</StatNumber>
        </Skeleton>
      </Card>
    </Stack>
  );
};
