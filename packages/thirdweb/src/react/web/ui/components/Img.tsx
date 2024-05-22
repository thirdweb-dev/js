"use client";
import { useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { Skeleton } from "./Skeleton.js";

// Note: Must not use useConnectUI here

/**
 * @internal
 */
export const Img: React.FC<{
  width?: string;
  height?: string;
  src?: string;
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
  style?: React.CSSProperties;
  fallbackImage?: string;
  client: ThirdwebClient;
}> = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const propSrc = props.src;

  const widthPx = `${props.width}px`;
  const heightPx = `${props.height || props.width}px`;

  if (propSrc === undefined) {
    return <Skeleton width={widthPx} height={heightPx} />;
  }

  const getSrc = () => {
    try {
      return resolveScheme({
        uri: propSrc,
        client: props.client,
      });
    } catch {
      return props.src;
    }
  };

  const src = getSrc();

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyItems: "center",
      }}
    >
      {!isLoaded && <Skeleton width={widthPx} height={heightPx} />}
      <img
        onLoad={() => {
          setIsLoaded(true);
        }}
        key={src}
        width={props.width}
        height={props.height}
        src={src}
        alt={props.alt || ""}
        loading={props.loading}
        decoding="async"
        style={{
          objectFit: "contain",
          height: !isLoaded
            ? 0
            : props.height
              ? `${props.height}px`
              : undefined,
          width: !isLoaded ? 0 : props.width ? `${props.width}px` : undefined,
          userSelect: "none",
          visibility: isLoaded ? "visible" : "hidden",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          ...props.style,
        }}
        draggable={false}
        className={props.className}
        onError={(e) => {
          if (
            props.fallbackImage &&
            e.currentTarget.src !== props.fallbackImage
          ) {
            e.currentTarget.src = props.fallbackImage;
          }
        }}
      />
    </div>
  );
};
