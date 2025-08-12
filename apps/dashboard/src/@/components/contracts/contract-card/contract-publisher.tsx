"use client";

import Link from "next/link";
import { Blobbie } from "thirdweb/react";
import { Img } from "@/components/blocks/Img";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { shortenIfAddress } from "@/utils/usedapp-external";

export function ContractPublisher(props: {
  ensName: string | undefined;
  address: string;
  ensAvatar: string | undefined;
}) {
  const displayName = props.ensName || props.address;
  return (
    <Link
      className="flex shrink-0 items-center gap-1.5 hover:underline"
      href={`/${displayName}`}
      target="_blank"
    >
      <Img
        className="size-5 rounded-full object-cover"
        src={
          resolveSchemeWithErrorHandler({
            client: getClientThirdwebClient(),
            uri: props.ensAvatar,
          }) || ""
        }
        fallback={<Blobbie address={props.address} />}
      />

      <span className="text-xs"> {shortenIfAddress(displayName)}</span>
    </Link>
  );
}
