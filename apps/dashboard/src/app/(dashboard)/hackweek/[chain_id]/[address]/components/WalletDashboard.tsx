"use client";
import type { ChainMetadata } from "thirdweb/chains";
import { useBalance } from "../hooks/getBalance";
import { useGetTxActivity } from "../hooks/useGetTxActivity";
import { useGetERC20Tokens } from "../hooks/useGetERC20Tokens";
import { useGetNFTs } from "../hooks/useGetNFTs";
import { mockWalletData } from "../utils/mockData";
import { ActivityOverview } from "./ActivityOverview";
import { BalanceOverview } from "./BalanceOverview";
import { TokenHoldings } from "./TokenHoldings";

export function WalletDashboard(props: {
  address: string;
  chain: ChainMetadata;
}) {
  const {
    balance,
    isLoading: isLoadingBalance,
    error: errorBalance,
  } = useBalance(props.chain.chainId, props.address);
  if (errorBalance) {
    console.error("Error fetching balance:", errorBalance);
  }
  const {
    tokens,
    isLoading: isLoadingERC20,
    // error: errorERC20,
  } = useGetERC20Tokens(props.chain.chainId, props.address);
  // if (errorERC20) {
  //   console.error("Error fetching ERC20 tokens:", errorERC20);
  // }
  const {
    nfts,
    isLoading: isLoadingNFTs,
    // error: errorNFTs,
  } = useGetNFTs(props.chain.chainId, props.address);
  // if (errorNFTs) {
  //   console.error("Error fetching NFTs:", errorNFTs);
  // }

  const { txActivity, isLoading: isLoadingActivity } = useGetTxActivity(props.chain.chainId, props.address)

  return (
    <div className="grid gap-6">
      <BalanceOverview
        chain={props.chain}
        balance={balance}
        isLoading={isLoadingBalance}
      />
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
