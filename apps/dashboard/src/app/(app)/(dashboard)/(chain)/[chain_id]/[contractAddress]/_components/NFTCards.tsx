import Link from "next/link";
import { useMemo } from "react";
import { type NFT, type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { NFTMediaWithEmptyState } from "@/components/blocks/nft-media";
import { SkeletonContainer } from "@/components/ui/skeleton";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";

type NFTWithContract = NFT & { contractAddress: string; chainId: number };

const dummyMetadata: (idx: number) => NFTWithContract = (idx) => ({
  chainId: 1,
  contractAddress: ZERO_ADDRESS,
  id: BigInt(idx || 0),
  metadata: {
    description:
      "lorem ipsum loading sit amet consectetur adipisicing elit. Quisquam, quos.",
    id: BigInt(idx || 0),
    name: "Loading...",
    uri: `1-0x123-${idx}`,
  },
  owner: `0x_fake_${idx}`,
  supply: 1n,
  tokenAddress: ZERO_ADDRESS,
  tokenURI: `1-0x123-${idx}`,
  type: "ERC721",
});

interface NFTCardsProps {
  nfts: Array<NFTWithContract>;
  isPending: boolean;
  allNfts?: boolean;
  projectMeta: ProjectMeta | undefined;
  client: ThirdwebClient;
}

export const NFTCards: React.FC<NFTCardsProps> = ({
  nfts,
  isPending,
  allNfts,
  projectMeta,
  client,
}) => {
  const dummyData = useMemo(() => {
    return Array.from({
      length: allNfts ? nfts.length : 3,
    }).map((_, idx) => dummyMetadata(idx));
  }, [nfts.length, allNfts]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {(isPending ? dummyData : nfts).map((token) => {
        const tokenId = token.id.toString();

        return (
          <div
            className="hover:-translate-y-0.5 relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-background duration-200 hover:scale-[1.01]"
            key={`${token.chainId}_${token.contractAddress}_${tokenId}`}
          >
            {/* border */}
            <div className="absolute inset-0 rounded-lg border border-border" />

            {/* image */}
            <div className="relative aspect-square w-full overflow-hidden">
              <SkeletonContainer
                className="h-full w-full rounded-lg"
                loadedData={isPending ? undefined : token.metadata}
                render={(v) => {
                  return (
                    <NFTMediaWithEmptyState
                      client={client}
                      height="100%"
                      metadata={v}
                      requireInteraction
                      width="100%"
                    />
                  );
                }}
                skeletonData={token.metadata}
              />
            </div>

            <div className="p-4">
              {/* title */}
              <SkeletonContainer
                className="mb-2"
                loadedData={isPending ? undefined : token.metadata}
                render={(v) => {
                  return (
                    <h2 className="font-semibold tracking-tight">
                      <Link
                        className="before:absolute before:inset-0"
                        href={buildContractPagePath({
                          chainIdOrSlug: token.chainId.toString(),
                          contractAddress: token.contractAddress,
                          projectMeta,
                          subpath: `/nfts/${tokenId}`,
                        })}
                      >
                        {v.name}
                      </Link>
                    </h2>
                  );
                }}
                skeletonData={token.metadata}
              />

              {/* Description */}
              <SkeletonContainer
                loadedData={isPending ? undefined : token.metadata}
                render={(v) => {
                  return (
                    <p className="line-clamp-3 text-muted-foreground text-sm">
                      {v.description ? v.description : <i>No description</i>}
                    </p>
                  );
                }}
                skeletonData={token.metadata}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
