/* eslint-disable @next/next/no-img-element */
import { replaceIpfsUrl } from "lib/sdk";
import { forwardRef } from "react";

const fallbackIcon = replaceIpfsUrl(
  "ipfs://QmU1r24UsmGg2w2RePz98zV5hR3CnjvakLZzB6yH4prPFh/globe.svg",
);

type ImageProps = React.ComponentProps<"img">;

type ChainIconProps = ImageProps & {
  ipfsSrc?: string;
  size: ImageProps["width"];
};

export const ChainIcon = forwardRef<HTMLImageElement, ChainIconProps>(
  ({ ipfsSrc, size, ...restProps }, ref) => {
    const src = ipfsSrc ? replaceIpfsUrl(ipfsSrc) : fallbackIcon;
    // treat size of number as "px"
    size = typeof size === "number" ? `${size}px` : size;

    return (
      <img
        {...restProps}
        ref={ref}
        // render different image element if src changes to avoid showing old image while loading new one
        key={src}
        src={src}
        width={size}
        height={size}
        style={{
          objectFit: "contain",
        }}
        loading={restProps.loading || "lazy"}
        decoding="async"
        alt=""
        // fallbackSrc is not working
        onError={(event) => {
          event.currentTarget.srcset = `${fallbackIcon} 1x`;
          event.currentTarget.src = fallbackIcon;
        }}
      />
    );
  },
);
