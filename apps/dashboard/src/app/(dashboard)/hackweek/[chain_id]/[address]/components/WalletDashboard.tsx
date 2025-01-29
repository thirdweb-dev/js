"use client";
import type { ChainMetadata } from "thirdweb/chains";
import { useGetERC20Tokens } from "../hooks/useGetERC20Tokens";
import { useGetNFTs } from "../hooks/useGetNFTs";
import { useGetRecentTransactions } from "../hooks/useGetTxActivity";
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
  const { txActivity, isLoading: isLoadingActivity } = useGetRecentTransactions(
    props.chain.chainId,
    props.address,
  );

  return (
    <div className="grid gap-6">
      {!isLoadingERC20 && !isLoadingNFTs && (
        <NebulaInterface
          chainId={props.chain.chainId}
          address={props.address}
          transactions={mockWalletData.transactions}
          contracts={mockWalletData.contracts}
          tokens={tokens}
          nfts={nfts}
        />
      )}

      <ActivityOverview
        transactions={txActivity}
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
