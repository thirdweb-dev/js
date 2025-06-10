"use client";

import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

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
        style={{
          width: props.width,
          height: props.height,
        }}
        className={cn(
          "grid h-full flex-shrink-0 place-items-center overflow-hidden rounded-lg border border-border object-contain",
          props.className,
        )}
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
      style={{
        width: props.width,
        height: props.height,
      }}
      className={cn(
        "flex-shrink-0 overflow-hidden rounded-lg object-contain ",
        props.className,
      )}
    >
      <MediaRenderer
        client={props.client}
        src={props.metadata.animation_url || props.metadata.image}
        alt={props.metadata.name?.toString() || ""}
        poster={props.metadata.image}
        requireInteraction={props.requireInteraction}
        controls={props.controls}
        className="[&>div]:!bg-accent [&_a]:!text-muted-foreground [&_a]:!no-underline [&_svg]:!size-6 [&_svg]:!text-muted-foreground aspect-square h-full w-full"
      />
    </div>
  );
};
