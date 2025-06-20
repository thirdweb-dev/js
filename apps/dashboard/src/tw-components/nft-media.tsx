"use client";

import { ImageIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import { cn } from "@/lib/utils";

export const NFTMediaWithEmptyState: React.FC<{
  className?: string;
  width?: string;
  height?: string;
  metadata: {
    image?: string | null;
    animation_url?: string | null;
    name?: string | number | null;
  };
  requireInteraction?: boolean;
  controls?: boolean;
  client: ThirdwebClient;
}> = (props) => {
  // No media
  if (!(props.metadata.image || props.metadata.animation_url)) {
    return (
      <div
        className={cn(
          "grid h-full flex-shrink-0 place-items-center overflow-hidden rounded-lg border border-border object-contain",
          props.className,
        )}
        style={{
          height: props.height,
          width: props.width,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="size-8 text-muted-foreground" />
          <span className="text-muted-foreground">No Media</span>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex-shrink-0 overflow-hidden rounded-lg object-contain ",
        props.className,
      )}
      style={{
        height: props.height,
        width: props.width,
      }}
    >
      <MediaRenderer
        alt={props.metadata.name?.toString() || ""}
        className="[&>div]:!bg-accent [&_a]:!text-muted-foreground [&_a]:!no-underline [&_svg]:!size-6 [&_svg]:!text-muted-foreground aspect-square h-full w-full"
        client={props.client}
        controls={props.controls}
        poster={props.metadata.image}
        requireInteraction={props.requireInteraction}
        src={props.metadata.animation_url || props.metadata.image}
      />
    </div>
  );
};
