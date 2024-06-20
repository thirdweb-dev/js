import {
  useAddress,
  type useContract,
  useTokenBalance,
  useTokenSupply,
} from "@thirdweb-dev/react";
import { TokenSupplyLayout } from "./supply-layout";

interface TokenBalancesProps {
  contractQuery: ReturnType<typeof useContract>;
}

export const TokenSupply: React.FC<TokenBalancesProps> = ({
  contractQuery,
}) => {
  const address = useAddress();

  const { data: tokenSupply, isSuccess: isTokenSupplySuccess } = useTokenSupply(
    contractQuery.contract,
  );
  const { data: ownedBalance, isSuccess: isOwnedBalanceSuccess } =
    useTokenBalance(contractQuery.contract, address);
  return (
    <TokenSupplyLayout
      isTokenSupplySuccess={isTokenSupplySuccess}
      tokenSupply={tokenSupply}
      isOwnedBalanceSuccess={isOwnedBalanceSuccess}
      address={address}
      ownedBalance={ownedBalance}
    />
  );
};
