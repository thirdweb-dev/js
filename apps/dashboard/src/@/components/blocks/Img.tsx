/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "../../lib/useIsomorphicLayoutEffect";

type imgElementProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  skeleton?: React.ReactNode;
  fallback?: React.ReactNode;
  src: string | undefined;
  containerClassName?: string;
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
  const { className, fallback, skeleton, containerClassName, ...restProps } =
    props;
  const defaultSkeleton = <div className="animate-pulse bg-accent" />;
  const defaultFallback = <div className="bg-accent" />;
  const imgRef = useRef<HTMLImageElement>(null);

  useIsomorphicLayoutEffect(() => {
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
    <div className={cn("relative shrink-0", containerClassName)}>
      <img
        {...restProps}
        // avoid setting empty src string to prevent request to the entire page
        alt={restProps.alt || ""}
        className={cn(
          "fade-in-0 object-cover transition-opacity duration-300",
          className,
        )}
        decoding="async"
        onError={() => {
          setStatus("fallback");
        }}
        ref={imgRef}
        src={restProps.src || undefined}
        style={{
          opacity: status === "loaded" ? 1 : 0,
          ...restProps.style,
        }}
      />

      {status !== "loaded" && (
        <div
          className={cn(
            "fade-in-0 absolute inset-0 overflow-hidden transition-opacity duration-300 [&>*]:h-full [&>*]:w-full",
            className,
          )}
          style={restProps.style}
        >
          {status === "pending" && (skeleton || defaultSkeleton)}
          {status === "fallback" && (fallback || defaultFallback)}
        </div>
      )}
    </div>
  );
}
