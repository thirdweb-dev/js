import { thirdwebClient } from "@/constants/client";
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
  if (!(props.metadata.image || props.metadata.animation_url)) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-xl object-contain flex-shrink-0 border grid place-items-center",
          props.width && `w-[${props.width}]`,
          props.height && `h-[${props.height}]`,
          props.className,
        )}
      >
        <div className="flex flex-col gap-1 items-center">
          <ImageIcon className="size-6" />
          <span className="text-sm font-semibold">No Media</span>
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
        "overflow-hidden rounded-xl object-contain flex-shrink-0",

        props.className,
      )}
    >
      <MediaRenderer
        client={thirdwebClient}
        src={props.metadata.animation_url || props.metadata.image}
        alt={props.metadata.name?.toString() || ""}
        poster={props.metadata.image}
        requireInteraction={props.requireInteraction}
        controls={props.controls}
        className="w-full h-full"
      />
    </div>
  );
};
