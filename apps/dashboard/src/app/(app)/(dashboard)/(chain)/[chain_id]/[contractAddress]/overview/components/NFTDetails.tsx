"use client";

import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ArrowRightIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC721 from "thirdweb/extensions/erc721";
import * as ERC1155 from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { NFTCards } from "../../_components/NFTCards";
import { buildContractPagePath } from "../../_utils/contract-page-path";

type NFTDetailsProps = {
  contract: ThirdwebContract;
  trackingCategory: string;
  isErc721: boolean;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
};

export function NFTDetails({
  contract,
  trackingCategory,
  isErc721,
  chainSlug,
  projectMeta,
}: NFTDetailsProps) {
  const nftsHref = buildContractPagePath({
    projectMeta,
    chainIdOrSlug: chainSlug,
    contractAddress: contract.address,
    subpath: "/nfts",
  });

  const nftQuery = useReadContract(
    isErc721 ? ERC721.getNFTs : ERC1155.getNFTs,
    {
      contract,
      count: 5,
      includeOwners: false,
    },
  );

  const displayableNFTs =
    nftQuery.data
      ?.filter((token) => token.metadata.image || token.metadata.animation_url)
      .slice(0, 3) || [];

  return displayableNFTs.length === 0 && !nftQuery.isPending ? null : (
    <div className="rounded-lg border bg-card">
      {/* header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold text-xl tracking-tight">NFTs</h2>
        <Button variant="outline" asChild className="bg-background" size="sm">
          <TrackedLinkTW
            category={trackingCategory}
            label="view_all_nfts"
            href={nftsHref}
            className="text-muted-foreground"
          >
            View all <ArrowRightIcon className="ml-2 size-4 " />
          </TrackedLinkTW>
        </Button>
      </div>

      {/* cards */}
      <div className="p-6">
        <NFTCards
          client={contract.client}
          projectMeta={projectMeta}
          nfts={displayableNFTs.map((t) => ({
            ...t,
            contractAddress: contract.address,
            chainId: contract.chain.id,
          }))}
          trackingCategory={trackingCategory}
          isPending={nftQuery.isPending}
        />
      </div>
    </div>
  );
}
