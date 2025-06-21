"use client";

import { useMemo } from "react";
import { type ThirdwebContract, toTokens } from "thirdweb";
import {
  getBalance,
  getCurrencyMetadata,
  totalSupply,
} from "thirdweb/extensions/erc20";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { TokenDetailsCardUI } from "./supply-layout";

interface TokenBalancesProps {
  contract: ThirdwebContract;
}

export const TokenDetailsCard: React.FC<TokenBalancesProps> = ({
  contract,
}) => {
  const address = useActiveAccount()?.address;

  const ownedTokenBalanceQuery = useReadContract(getBalance, {
    address: address || "",
    contract,
    queryOptions: { enabled: !!address },
  });

  const tokenSupplyQuery = useReadContract(totalSupply, {
    contract,
  });

  const tokenMetadataQuery = useReadContract(getCurrencyMetadata, { contract });

  const tokenSupply = useMemo(() => {
    if (
      tokenMetadataQuery.data === undefined ||
      tokenSupplyQuery.data === undefined
    ) {
      return undefined;
    }

    return {
      ...tokenMetadataQuery.data,
      chainId: contract.chain.id,
      displayValue: toTokens(
        tokenSupplyQuery.data,
        tokenMetadataQuery.data.decimals,
      ),
      tokenAddress: contract.address,
      value: tokenSupplyQuery.data,
    };
  }, [
    tokenMetadataQuery.data,
    tokenSupplyQuery.data,
    contract.address,
    contract.chain.id,
  ]);

  return (
    <TokenDetailsCardUI
      isWalletConnected={!!address}
      ownedBalance={ownedTokenBalanceQuery.data}
      tokenSupply={tokenSupply}
    />
  );
};
