"use client";

import { useEffect, useState } from "react";
import { MediaRenderer, type MediaRendererProps } from "thirdweb/react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../ui/skeleton";

export function CustomMediaRenderer(props: MediaRendererProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>(undefined);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (loadedSrc && loadedSrc !== props.src) {
      setLoadedSrc(undefined);
    }
  }, [loadedSrc, props.src]);

  return (
    <div
      className="relative"
      onLoad={() => {
        if (props.src) {
          setLoadedSrc(props.src);
        }
      }}
    >
      {!loadedSrc && <Skeleton className="absolute inset-0" />}
      <MediaRenderer
        {...props}
        className={cn(
          props.className,
          "[&>div]:!bg-accent [&_a]:!text-muted-foreground [&_a]:!no-underline [&_svg]:!size-6 [&_svg]:!text-muted-foreground relative z-10",
        )}
      />
    </div>
  );
}
