import { BoxIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { Img } from "@/components/blocks/Img";
import { resolveSchemeWithErrorHandler } from "../../../lib/resolveSchemeWithErrorHandler";
import { cn } from "../../../lib/utils";

export function ProjectAvatar(props: {
  src: string | undefined;
  className: string | undefined;
  client: ThirdwebClient;
}) {
  return (
    <Img
      alt={""}
      className={cn("rounded-full border border-border", props.className)}
      fallback={
        <div className="flex items-center justify-center bg-card">
          <BoxIcon className="size-[50%] text-muted-foreground" />
        </div>
      }
      src={
        resolveSchemeWithErrorHandler({
          client: props.client,
          uri: props.src,
        }) || ""
      }
    />
  );
}
