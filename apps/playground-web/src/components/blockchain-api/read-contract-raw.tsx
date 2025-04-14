"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { MediaRenderer, useReadContract } from "thirdweb/react";

const onChainCryptoPunks = getContract({
  address: "0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2",
  chain: ethereum,
  client: THIRDWEB_CLIENT,
});

function encodeUriData(dataUri: string): string {
  const dataStart = dataUri.indexOf(",") + 1;
  return (
    dataUri.slice(0, dataStart) +
      encodeURIComponent(dataUri.slice(dataStart)) || ""
  );
}

export function ReadContractRawPreview() {
  // Read the image of the tokenId #1
  const { data } = useReadContract({
    contract: onChainCryptoPunks,
    method: "function punkImageSvg(uint16 index) view returns (string svg)",
    params: [1],
    from: "0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2",
  });

  return (
    <div className="rounded-2xl border bg-card shadow-xl">
      <MediaRenderer client={THIRDWEB_CLIENT} src={encodeUriData(data ?? "")} />
    </div>
  );
}
