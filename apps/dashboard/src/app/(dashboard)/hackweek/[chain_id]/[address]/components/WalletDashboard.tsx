"use client";
import type { ChainMetadata } from "thirdweb/chains";
import { useGetERC20Tokens } from "../hooks/useGetERC20Tokens";
import { useGetNFTs } from "../hooks/useGetNFTs";
import { useGetRecentTransactions } from "../hooks/useGetRecentTransactions";
import { mockWalletData } from "../utils/mockData";
import { ActivityOverview } from "./ActivityOverview";
import { NebulaInterface } from "./NebulaInterface";
import { TokenHoldings } from "./TokenHoldings";

export function WalletDashboard(props: {
  address: string;
  chain: ChainMetadata;
}) {
  const { tokens, isLoading: isLoadingERC20 } = useGetERC20Tokens(
    props.chain.chainId,
    props.address,
  );
  const { nfts, isLoading: isLoadingNFTs } = useGetNFTs(
    props.chain.chainId,
    props.address,
  );
  const { transactions, isLoading: isLoadingActivity } =
    useGetRecentTransactions(props.chain.chainId, props.address);

  return (
    <div className="grid gap-6">
      {!isLoadingERC20 && !isLoadingNFTs && (
        <NebulaInterface
          chain={props.chain}
          address={props.address}
          transactions={transactions}
          contracts={mockWalletData.contracts}
          tokens={tokens}
          nfts={nfts}
        />
      )}

      <ActivityOverview
        chain={props.chain}
        transactions={transactions}
        isLoading={isLoadingActivity}
        contracts={mockWalletData.contracts}
      />
      <TokenHoldings
        chain={props.chain}
        tokens={tokens}
        nfts={nfts}
        isLoading={isLoadingERC20 || isLoadingNFTs}
      />
    </div>
  );
}
