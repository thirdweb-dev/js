"use client";

import type { ThirdwebClient } from "thirdweb";
import { Img } from "@/components/blocks/Img";
import { cn } from "@/lib/utils";
import { fallbackChainIcon } from "@/utils/chain-icons";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

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
  const resolvedSrc = src
    ? resolveSchemeWithErrorHandler({
        client,
        uri: src,
      })
    : fallbackChainIcon;

  return (
    <Img
      {...restProps}
      // render different image element if src changes to avoid showing old image while loading new one
      alt=""
      className={cn("object-contain", restProps.className)}
      fallback={<img alt="" src={fallbackChainIcon} />}
      key={resolvedSrc}
      loading={restProps.loading || "lazy"}
      skeleton={<span className="animate-pulse rounded-full bg-border" />}
      src={resolvedSrc}
    />
  );
};
