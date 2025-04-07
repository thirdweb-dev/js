"use client";

import { useThirdwebClient } from "@/constants/thirdweb.client";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
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
}> = (props) => {
  const client = useThirdwebClient();

  // No media
  if (!(props.metadata.image || props.metadata.animation_url)) {
    return (
      <div
        style={{
          width: props.width,
          height: props.height,
        }}
        className={cn(
          "grid flex-shrink-0 place-items-center overflow-hidden rounded-lg border border-border object-contain",
          props.className,
        )}
      >
        <div className="flex flex-col items-center gap-1">
          <ImageIcon className="size-6" />
          <span className="font-semibold text-sm">No Media</span>
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
        "flex-shrink-0 overflow-hidden rounded-lg object-contain",
        props.className,
      )}
    >
      <MediaRenderer
        client={client}
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
