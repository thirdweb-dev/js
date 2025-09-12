"use client";
import { useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { radius } from "../../../core/design-system/index.js";
import { Container } from "./basic.js";
import { Skeleton } from "./Skeleton.js";

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
  fallback?: React.ReactNode;
  client: ThirdwebClient;
}> = (props) => {
  const [_status, setStatus] = useState<"pending" | "fallback" | "loaded">(
    "pending",
  );

  const status =
    props.src === undefined
      ? "pending"
      : props.src === ""
        ? "fallback"
        : _status;

  const propSrc = props.src;

  const widthPx = `${props.width}px`;
  const heightPx = `${props.height || props.width}px`;

  if (propSrc === undefined) {
    return <Skeleton height={heightPx} width={widthPx} />;
  }

  const getSrc = () => {
    try {
      return resolveScheme({
        client: props.client,
        uri: propSrc,
      });
    } catch {
      return props.src;
    }
  };

  const src = getSrc();
  const isLoaded = status === "loaded";

  return (
    <div
      style={{
        alignItems: "center",
        display: "inline-flex",
        flexShrink: 0,
        justifyItems: "center",
        position: "relative",
      }}
    >
      {status === "pending" && <Skeleton height={heightPx} width={widthPx} />}
      {status === "fallback" &&
        (props.fallback || (
          <Container
            bg="tertiaryBg"
            borderColor="borderColor"
            style={{
              height: heightPx,
              width: widthPx,
              borderRadius: radius.md,
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            <div />
          </Container>
        ))}

      <img
        alt={props.alt || ""}
        className={props.className}
        decoding="async"
        draggable={false}
        height={props.height}
        key={src}
        loading={props.loading}
        onError={(e) => {
          if (
            props.fallbackImage &&
            e.currentTarget.src !== props.fallbackImage
          ) {
            e.currentTarget.src = props.fallbackImage;
          } else {
            setStatus("fallback");
          }
        }}
        onLoad={() => {
          setStatus("loaded");
        }}
        src={src}
        style={{
          height: !isLoaded
            ? 0
            : props.height
              ? `${props.height}px`
              : undefined,
          objectFit: "contain",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          userSelect: "none",
          visibility: isLoaded ? "visible" : "hidden",
          width: !isLoaded ? 0 : props.width ? `${props.width}px` : undefined,
          ...props.style,
        }}
        width={props.width}
      />
    </div>
  );
};
