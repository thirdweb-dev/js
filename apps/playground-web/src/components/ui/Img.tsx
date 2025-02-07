/* eslint-disable @next/next/no-img-element */

"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type imgElementProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  skeleton?: React.ReactNode;
  fallback?: React.ReactNode;
  src: string | undefined;
};

export function Img(props: imgElementProps) {
  const [_status, setStatus] = useState<"pending" | "fallback" | "loaded">(
    "pending",
  );
  const status =
    props.src === undefined
      ? "pending"
      : props.src === ""
        ? "fallback"
        : _status;
  const { className, fallback, skeleton, ...restProps } = props;
  const defaultSkeleton = <div className="animate-pulse bg-accent" />;
  const defaultFallback = <div className="bg-accent" />;
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
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
  }, []);

  return (
    <div className="relative">
      <img
        {...restProps}
        // avoid setting empty src string to prevent request to the entire page
        src={restProps.src || undefined}
        ref={imgRef}
        onError={() => {
          setStatus("fallback");
        }}
        style={{
          opacity: status === "loaded" ? 1 : 0,
          ...restProps.style,
        }}
        alt={restProps.alt || ""}
        className={cn(
          "fade-in-0 object-cover transition-opacity duration-300",
          className,
        )}
        decoding="async"
      />

      {status !== "loaded" && (
        <div
          style={restProps.style}
          className={cn(
            "fade-in-0 absolute inset-0 overflow-hidden transition-opacity duration-300 [&>*]:h-full [&>*]:w-full",
            className,
          )}
        >
          {status === "pending" && (skeleton || defaultSkeleton)}
          {status === "fallback" && (fallback || defaultFallback)}
        </div>
      )}
    </div>
  );
}
