import { Image, forwardRef } from "@chakra-ui/react";
import { replaceIpfsUrl } from "lib/sdk";

const fallbackIcon = replaceIpfsUrl(
  "ipfs:///QmU1r24UsmGg2w2RePz98zV5hR3CnjvakLZzB6yH4prPFh/globe.svg",
);

type ChainIconProps = {
  ipfsSrc?: string;
  size: number;
};

export const ChainIcon = forwardRef<ChainIconProps, typeof Image>(
  (props, ref) => {
    const src = props.ipfsSrc ? replaceIpfsUrl(props.ipfsSrc) : fallbackIcon;

    const size = `${props.size}px`;

    // TODO - use sizes to create srcset

    return (
      <Image
        ref={ref}
        // render different image element if src changes to avoid showing old image while loading new one
        key={src}
        src={src}
        width={size}
        height={size}
        style={{
          objectFit: "contain",
        }}
        loading="lazy"
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
