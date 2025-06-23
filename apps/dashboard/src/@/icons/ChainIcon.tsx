"use client";

import type { ThirdwebClient } from "thirdweb";
import { Img } from "@/components/blocks/Img";
/* eslint-disable @next/next/no-img-element */
import { replaceIpfsUrl } from "@/lib/sdk";
import { cn } from "@/lib/utils";
import { fallbackChainIcon } from "@/utils/chain-icons";

type ImageProps = React.ComponentProps<"img">;

type ChainIconProps = Omit<ImageProps, "src"> & {
  client: ThirdwebClient;
  src?: string;
};

export const ChainIconClient = ({
  client,
  src,
  ...restProps
}: ChainIconProps) => {
  const resolvedSrc = src ? replaceIpfsUrl(src, client) : fallbackChainIcon;

  return (
    <Img
      {...restProps}
      // render different image element if src changes to avoid showing old image while loading new one
      alt=""
      className={cn("object-contain", restProps.className)}
      fallback={<img alt="" src={fallbackChainIcon} />}
      key={resolvedSrc}
      loading={restProps.loading || "lazy"}
      skeleton={<div className="animate-pulse rounded-full bg-border" />}
      src={resolvedSrc}
    />
  );
};
