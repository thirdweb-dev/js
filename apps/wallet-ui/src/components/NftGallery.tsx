import { getErc721Tokens } from "@/lib/assets/erc721";
import { SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS } from "@/util/simplehash";
import type { Address } from "thirdweb";
import { defineChain } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
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
}: { owner: Address; chainId?: number; page?: number }) {
  const erc721TokensResult = await getErc721Tokens({
    owner,
    chainIds: chainId ? [Number(chainId)] : SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS,
    limit: 36,
  });

  if (erc721TokensResult.tokens.length === 0) {
    return <NftGalleryEmpty chainId={chainId} />;
  }

  return (
    <NftGalleryLayout>
      {erc721TokensResult.tokens.map((token) => (
        <NftCard
          key={token.contractAddress + token.tokenId + token.chainId}
          data={token}
        />
      ))}
    </NftGalleryLayout>
  );
}

async function NftGalleryEmpty({ chainId }: { chainId?: number }) {
  const chain = chainId ? await getChainMetadata(defineChain(chainId)) : null;

  return (
    <div
      key="empty"
      className="flex flex-col items-center justify-center h-full gap-5 text-center opacity-50 min-h-[300px] border rounded-md"
    >
      {chain && <ChainIcon iconUrl={chain.icon?.url} className="w-24 h-24" />}
      <div className="text-xl font-medium">No NFTs found</div>
    </div>
  );
}

function NftGalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      key="layout"
      className="grid justify-between w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {children}
    </div>
  );
}
