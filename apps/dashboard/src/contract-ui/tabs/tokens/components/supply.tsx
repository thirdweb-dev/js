import { thirdwebClient } from "@/constants/client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useMemo } from "react";
import { getContract, toTokens } from "thirdweb";
import {
  getBalance,
  getCurrencyMetadata,
  totalSupply,
} from "thirdweb/extensions/erc20";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { TokenSupplyLayout } from "./supply-layout";

interface TokenBalancesProps {
  contractAddress: string;
  chainId: number;
}

export const TokenSupply: React.FC<TokenBalancesProps> = ({
  contractAddress,
  chainId,
}) => {
  const address = useActiveAccount()?.address;

  const chain = useV5DashboardChain(chainId);

  const contract = useMemo(
    () =>
      getContract({
        address: contractAddress,
        chain,
        client: thirdwebClient,
      }),
    [chain, contractAddress],
  );

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
