"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { getNFT } from "thirdweb/extensions/erc721";
import { MediaRenderer, useReadContract } from "thirdweb/react";

const azukiContract = getContract({
  address: "0xed5af388653567af2f388e6224dc7c4b3241c544",
  chain: ethereum,
  client: THIRDWEB_CLIENT,
});

export function ReadContractExtensionPreview() {
  const { data } = useReadContract(getNFT, {
    contract: azukiContract,
    tokenId: 1n,
  });

  return (
    <div className="rounded-2xl backdrop-blur">
      <MediaRenderer
        client={THIRDWEB_CLIENT}
        src={data?.metadata.image}
        className="shadow-gray-100"
      />
    </div>
  );
}
