import { Img } from "@/components/blocks/Img";
import { BoxIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { resolveSchemeWithErrorHandler } from "../../../lib/resolveSchemeWithErrorHandler";
import { cn } from "../../../lib/utils";

export function ProjectAvatar(props: {
  src: string | undefined;
  className: string | undefined;
  client: ThirdwebClient;
}) {
  return (
    <Img
      src={
        resolveSchemeWithErrorHandler({
          uri: props.src,
          client: props.client,
        }) || ""
      }
      className={cn("rounded-full border border-border", props.className)}
      alt={""}
      fallback={
        <div className="flex items-center justify-center bg-card">
          <BoxIcon className="size-[50%] text-muted-foreground" />
        </div>
      }
    />
  );
}
