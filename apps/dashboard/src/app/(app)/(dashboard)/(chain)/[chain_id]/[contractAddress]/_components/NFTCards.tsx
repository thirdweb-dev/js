import { SkeletonContainer } from "@/components/ui/skeleton";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useMemo } from "react";
import { type NFT, ZERO_ADDRESS } from "thirdweb";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";

type NFTWithContract = NFT & { contractAddress: string; chainId: number };

const dummyMetadata: (idx: number) => NFTWithContract = (idx) => ({
  chainId: 1,
  contractAddress: ZERO_ADDRESS,
  id: BigInt(idx || 0),
  tokenURI: `1-0x123-${idx}`,
  metadata: {
    name: "Loading...",
    description:
      "lorem ipsum loading sit amet consectetur adipisicing elit. Quisquam, quos.",
    id: BigInt(idx || 0),
    uri: `1-0x123-${idx}`,
  },
  owner: `0x_fake_${idx}`,
  type: "ERC721",
  supply: 1n,
  tokenAddress: ZERO_ADDRESS,
});

interface NFTCardsProps {
  nfts: Array<NFTWithContract>;
  trackingCategory: string;
  isPending: boolean;
  allNfts?: boolean;
  projectMeta: ProjectMeta | undefined;
}

export const NFTCards: React.FC<NFTCardsProps> = ({
  nfts,
  trackingCategory,
  isPending,
  allNfts,
  projectMeta,
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
            key={`${token.chainId}_${token.contractAddress}_${tokenId}`}
            className="hover:-translate-y-0.5 relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-background duration-200 hover:scale-[1.01]"
          >
            {/* border */}
            <div className="absolute inset-0 rounded-lg border border-border" />

            {/* image */}
            <div className="relative aspect-square w-full overflow-hidden">
              <SkeletonContainer
                skeletonData={token.metadata}
                loadedData={isPending ? undefined : token.metadata}
                className="h-full w-full rounded-lg"
                render={(v) => {
                  return (
                    <NFTMediaWithEmptyState
                      metadata={v}
                      requireInteraction
                      width="100%"
                      height="100%"
                    />
                  );
                }}
              />
            </div>

            <div className="p-4">
              {/* title */}
              <SkeletonContainer
                skeletonData={token.metadata}
                loadedData={isPending ? undefined : token.metadata}
                className="mb-2"
                render={(v) => {
                  return (
                    <h2 className="font-semibold tracking-tight">
                      <TrackedLinkTW
                        category={trackingCategory}
                        label="view_nft"
                        href={buildContractPagePath({
                          projectMeta,
                          chainIdOrSlug: token.chainId.toString(),
                          contractAddress: token.contractAddress,
                          subpath: `/nfts/${tokenId}`,
                        })}
                        className="before:absolute before:inset-0"
                      >
                        {v.name}
                      </TrackedLinkTW>
                    </h2>
                  );
                }}
              />

              {/* Description */}
              <SkeletonContainer
                skeletonData={token.metadata}
                loadedData={isPending ? undefined : token.metadata}
                render={(v) => {
                  return (
                    <p className="line-clamp-3 text-muted-foreground text-sm">
                      {v.description ? v.description : <i>No description</i>}
                    </p>
                  );
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
