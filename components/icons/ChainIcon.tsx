import { Image } from "@chakra-ui/react";

const fallbackIcon = `https://ipfs.thirdwebcdn.com/ipfs/QmU1r24UsmGg2w2RePz98zV5hR3CnjvakLZzB6yH4prPFh/globe.svg`;

export const ChainIcon: React.FC<{
  ipfsSrc?: string;
  size: number;
  sizes?: readonly number[];
}> = (props) => {
  const src = props.ipfsSrc
    ? `https://ipfs.thirdwebcdn.com/ipfs/${props.ipfsSrc.slice(
        `ipfs://`.length,
      )}`
    : fallbackIcon;

  const size = `${props.size}px`;

  // TODO - use sizes to create srcset

  return (
    <Image
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
};
