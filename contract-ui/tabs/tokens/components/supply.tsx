import {
  Skeleton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import {
  getErcs,
  useAddress,
  useContract,
  useTokenBalance,
  useTokenSupply,
} from "@thirdweb-dev/react";
import { Card } from "tw-components";

interface TokenBalancesProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenSupply: React.FC<TokenBalancesProps> = ({
  contractQuery,
}) => {
  const address = useAddress();
  const { erc20 } = getErcs(contractQuery.contract);
  const { data: tokenSupply, isSuccess: isTokenSupplySuccess } =
    useTokenSupply(erc20);
  const { data: ownedBalance, isSuccess: isOwnedBalanceSuccess } =
    useTokenBalance(erc20, address);

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
