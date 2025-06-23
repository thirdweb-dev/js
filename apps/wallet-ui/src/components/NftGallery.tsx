import type { Address } from "thirdweb";
import { defineChain } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import { getErc721Tokens } from "@/lib/assets/erc721";
import { SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS } from "@/util/simplehash";
import { ChainIcon } from "./ChainIcon";
import NftCard, { NftLoadingCard } from "./NftCard";

export function NftGalleryLoading() {
  return (
    <NftGalleryLayout key="loading">
      {Array.from({ length: 36 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: For loading state
        <NftLoadingCard key={i} />
      ))}
    </NftGalleryLayout>
  );
}

export default async function NftGallery({
  owner,
  chainId,
}: {
  owner: Address;
  chainId?: number;
  page?: number;
}) {
  const erc721TokensResult = await getErc721Tokens({
    chainIds: chainId ? [Number(chainId)] : SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS,
    limit: 36,
    owner,
  });

  if (erc721TokensResult.tokens.length === 0) {
    return <NftGalleryEmpty chainId={chainId} />;
  }

  return (
    <NftGalleryLayout>
      {erc721TokensResult.tokens.map((token) => (
        <NftCard
          data={token}
          key={token.contractAddress + token.tokenId + token.chainId}
        />
      ))}
    </NftGalleryLayout>
  );
}

async function NftGalleryEmpty({ chainId }: { chainId?: number }) {
  const chain = chainId ? await getChainMetadata(defineChain(chainId)) : null;

  return (
    <div
      className="flex h-full min-h-[300px] flex-col items-center justify-center gap-5 rounded-md border text-center opacity-50"
      key="empty"
    >
      {chain && <ChainIcon className="h-24 w-24" iconUrl={chain.icon?.url} />}
      <div className="font-medium text-xl">No NFTs found</div>
    </div>
  );
}

function NftGalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="grid w-full grid-cols-1 justify-between gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      key="layout"
    >
      {children}
    </div>
  );
}
