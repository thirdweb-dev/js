"use client";
import { useEffect, useRef, useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { resolveScheme } from "../../../../utils/ipfs.js";
import { radius, type Theme } from "../../../core/design-system/index.js";
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
  skeletonColor?: keyof Theme["colors"];
}> = (props) => {
  const [_status, setStatus] = useState<"pending" | "fallback" | "loaded">(
    "pending",
  );
  const imgRef = useRef<HTMLImageElement>(null);

  const propSrc = props.src;

  const widthPx = `${props.width}px`;
  const heightPx = `${props.height || props.width}px`;

  const getSrc = () => {
    if (propSrc === undefined) {
      return undefined;
    }
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

  const status =
    src === undefined ? "pending" : src === "" ? "fallback" : _status;

  const isLoaded = status === "loaded";

  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl) {
      return;
    }
    if (imgEl.complete) {
      setStatus("loaded");
    } else {
      function handleLoad() {
        setStatus("loaded");
      }
      imgEl.addEventListener("load", handleLoad);
      return () => {
        imgEl.removeEventListener("load", handleLoad);
      };
    }

    return;
  }, []);

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
      {status === "pending" && (
        <Skeleton
          height={heightPx}
          width={widthPx}
          color={props.skeletonColor}
          style={props.style}
        />
      )}
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
              ...props.style,
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
        src={src || undefined}
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
