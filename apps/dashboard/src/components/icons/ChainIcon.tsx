"use client";

import { Img } from "@/components/blocks/Img";
/* eslint-disable @next/next/no-img-element */
import { replaceIpfsUrl } from "lib/sdk";
import { cn } from "../../@/lib/utils";
import { fallbackChainIcon } from "../../utils/chain-icons";

type ImageProps = React.ComponentProps<"img">;

type ChainIconProps = ImageProps & {
  ipfsSrc?: string;
};

export const ChainIcon = ({ ipfsSrc, ...restProps }: ChainIconProps) => {
  const src = ipfsSrc ? replaceIpfsUrl(ipfsSrc) : fallbackChainIcon;

  return (
    <Img
      {...restProps}
      // render different image element if src changes to avoid showing old image while loading new one
      key={src}
      className={cn("object-contain", restProps.className)}
      src={src}
      loading={restProps.loading || "lazy"}
      alt=""
      fallback={<img src={fallbackChainIcon} alt="" />}
      skeleton={<div className="animate-pulse rounded-full bg-border" />}
    />
  );
};
