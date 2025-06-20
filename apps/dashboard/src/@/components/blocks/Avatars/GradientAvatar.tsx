import type { ThirdwebClient } from "thirdweb";
import { Img } from "@/components/blocks/Img";
import { resolveSchemeWithErrorHandler } from "../../../lib/resolveSchemeWithErrorHandler";
import { cn } from "../../../lib/utils";
import { GradientBlobbie } from "./GradientBlobbie";

export function GradientAvatar(props: {
  src: string | undefined;
  id: string | undefined;
  className: string;
  client: ThirdwebClient;
}) {
  const resolvedSrc = props.src
    ? resolveSchemeWithErrorHandler({
        client: props.client,
        uri: props.src,
      })
    : props.src;

  return (
    <Img
      className={cn("rounded-full", props.className)}
      fallback={props.id ? <GradientBlobbie id={props.id} /> : undefined}
      src={resolvedSrc}
    />
  );
}
