"use client";

import type { ThirdwebContract } from "thirdweb";
import { useOwnedNFTsInsight } from "@/hooks/useWalletNFTs";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { NFTCards } from "../../_components/NFTCards";

interface NftsOwnedProps {
  contract: ThirdwebContract;
  isInsightSupported: boolean;
  projectMeta: ProjectMeta | undefined;
}

export const NftsOwned: React.FC<NftsOwnedProps> = ({
  contract,
  isInsightSupported,
  projectMeta,
}) => {
  const ownedNFTInsightQuery = useOwnedNFTsInsight({
    chainId: contract.chain.id,
    isInsightSupported: isInsightSupported,
    walletAddress: contract.address,
    client: contract.client,
    chain: contract.chain,
  });

  const nfts = ownedNFTInsightQuery.data || [];
  const error = ownedNFTInsightQuery.error;

  return nfts.length !== 0 ? (
    <NFTCards
      allNfts
      client={contract.client}
      isPending={ownedNFTInsightQuery.isPending}
      nfts={nfts.map((x) => ({
        chainId: contract.chain.id,
        contractAddress: x.tokenAddress,
        id: x.id.toString(),
        metadata: x.metadata,
        type: x.type,
      }))}
      projectMeta={projectMeta}
    />
  ) : ownedNFTInsightQuery.isPending ? null : error ? (
    <p className="text-sm text-muted-foreground">
      Failed to fetch NFTs for this account: {error.message}
    </p>
  ) : (
    <p className="text-sm text-muted-foreground">
      This account doesn't own any NFTs
    </p>
  );
};
