"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { getNFT } from "thirdweb/extensions/erc721";
import { MediaRenderer, useReadContract } from "thirdweb/react";

const contract = getContract({
  address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  chain: ethereum,
  client: THIRDWEB_CLIENT,
});

export function ReadContractExtensionPreview() {
  const { data } = useReadContract(getNFT, {
    contract,
    tokenId: 458n,
  });

  return (
    <div className="rounded-2xl backdrop-blur">
      <MediaRenderer
        client={THIRDWEB_CLIENT}
        src={data?.metadata.image}
        className="rounded-2xl shadow-gray-100"
        gatewayUrl="https://ipfs.io/ipfs/"
      />
    </div>
  );
}
