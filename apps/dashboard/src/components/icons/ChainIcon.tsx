"use client";

import { Img } from "@/components/blocks/Img";
/* eslint-disable @next/next/no-img-element */
import { replaceIpfsUrl } from "lib/sdk";
import type { ThirdwebClient } from "thirdweb";
import { cn } from "../../@/lib/utils";
import { fallbackChainIcon } from "../../utils/chain-icons";

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
      key={resolvedSrc}
      className={cn("object-contain", restProps.className)}
      src={resolvedSrc}
      loading={restProps.loading || "lazy"}
      alt=""
      fallback={<img src={fallbackChainIcon} alt="" />}
      skeleton={<div className="animate-pulse rounded-full bg-border" />}
    />
  );
};
