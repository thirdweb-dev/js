"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { NFTDescription, NFTMedia, NFTName, NFTProvider } from "thirdweb/react";

const nftContract = getContract({
  address: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
  chain: ethereum,
  client: THIRDWEB_CLIENT,
});

export function NftMediaBasicPreview() {
  return (
    <NFTProvider tokenId={0n} contract={nftContract}>
      <NFTMedia
        className="h-40 w-40 rounded-md"
        loadingComponent={<span>Loading...</span>}
      />
    </NFTProvider>
  );
}

export function NftMediaOverridePreview() {
  return (
    <NFTProvider tokenId={0n} contract={nftContract}>
      <NFTMedia
        className="h-40 w-40 rounded-md border"
        mediaResolver={{
          src: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/1.mp4",
          poster: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/0.png",
        }}
      />
    </NFTProvider>
  );
}

export function NftNameBasicPreview() {
  return (
    <NFTProvider tokenId={0n} contract={nftContract}>
      <NFTName loadingComponent={<span>Loading...</span>} />
    </NFTProvider>
  );
}

export function NftDescriptionBasicPreview() {
  return (
    <NFTProvider tokenId={0n} contract={nftContract}>
      <NFTDescription
        className="block px-6 text-center"
        loadingComponent={<span>Loading...</span>}
      />
    </NFTProvider>
  );
}

export function NftCardDemoPreview() {
  return (
    <NFTProvider tokenId={0n} contract={nftContract}>
      <div className="flex w-[230px] flex-col gap-3 rounded-lg border bg-zinc-900 px-1 py-3">
        <NFTMedia className="rounded-md px-2 text-center" />
        <NFTName className="px-2 font-bold" />
        <NFTDescription
          className="px-2 text-sm"
          loadingComponent={<span>Loading...</span>}
        />
      </div>
    </NFTProvider>
  );
}
