import { useMemo } from "react";
import { type ThirdwebContract, toTokens } from "thirdweb";
import {
  getBalance,
  getCurrencyMetadata,
  totalSupply,
} from "thirdweb/extensions/erc20";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { TokenSupplyLayout } from "./supply-layout";

interface TokenBalancesProps {
  contract: ThirdwebContract;
}

export const TokenSupply: React.FC<TokenBalancesProps> = ({ contract }) => {
  const address = useActiveAccount()?.address;

  const tokenBalanceQuery = useReadContract(getBalance, {
    contract,
    address: address || "",
    queryOptions: { enabled: !!address },
  });

  const tokenSupplyQuery = useReadContract(totalSupply, {
    contract,
    queryOptions: { enabled: !!address },
  });

  const tokenMetadataQuery = useReadContract(getCurrencyMetadata, { contract });

  const tokenSupply = useMemo(() => {
    if (
      tokenMetadataQuery.data === undefined ||
      tokenSupplyQuery.data === undefined
    ) {
      return {
        value: 0n,
        displayValue: "0.0",
        symbol: "LOA",
        decimals: 18,
        name: "Loading...",
      };
    }

    return {
      ...tokenMetadataQuery.data,
      value: tokenSupplyQuery.data,
      displayValue: toTokens(
        tokenSupplyQuery.data,
        tokenMetadataQuery.data.decimals,
      ),
    };
  }, [tokenMetadataQuery.data, tokenSupplyQuery.data]);

  return (
    <TokenSupplyLayout
      isTokenSupplySuccess={
        tokenSupplyQuery.isSuccess && tokenMetadataQuery.isSuccess
      }
      tokenSupply={tokenSupply}
      isOwnedBalanceSuccess={tokenBalanceQuery.isSuccess}
      address={address}
      ownedBalance={tokenBalanceQuery.data}
    />
  );
};
