"use client";

import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { getNFT } from "thirdweb/extensions/erc721";
import { MediaRenderer, useReadContract } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";

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
        className="rounded-2xl shadow-gray-100"
        client={THIRDWEB_CLIENT}
        gatewayUrl="https://ipfs.io/ipfs/"
        src={data?.metadata.image}
      />
    </div>
  );
}
