import { Img } from "@/components/blocks/Img";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { resolveSchemeWithErrorHandler } from "../../../lib/resolveSchemeWithErrorHandler";
import { cn } from "../../../lib/utils";

const gradients = [
  ["#fca5a5", "#b91c1c"],
  ["#fdba74", "#c2410c"],
  ["#fcd34d", "#b45309"],
  ["#fde047", "#a16207"],
  ["#a3e635", "#4d7c0f"],
  ["#86efac", "#15803d"],
  ["#67e8f9", "#0e7490"],
  ["#7dd3fc", "#0369a1"],
  ["#93c5fd", "#1d4ed8"],
  ["#a5b4fc", "#4338ca"],
  ["#c4b5fd", "#6d28d9"],
  ["#d8b4fe", "#7e22ce"],
  ["#f0abfc", "#a21caf"],
  ["#f9a8d4", "#be185d"],
  ["#fda4af", "#be123c"],
];

function getGradientForString(str: string) {
  const number = Math.abs(
    str.split("").reduce((acc, b, i) => acc + b.charCodeAt(0) * (i + 1), 0),
  );
  const index = number % gradients.length;
  return gradients[index];
}

export function GradientAvatar(props: {
  src: string | undefined;
  id: string | undefined;
  className: string;
  client: ThirdwebClient;
}) {
  const gradient = useMemo(() => {
    if (!props.id) {
      return undefined;
    }
    return getGradientForString(props.id);
  }, [props.id]);

  const resolvedSrc = props.src
    ? resolveSchemeWithErrorHandler({
        client: props.client,
        uri: props.src,
      })
    : props.src;

  return (
    <Img
      src={resolvedSrc}
      className={cn("rounded-full", props.className)}
      fallback={
        gradient ? (
          <div
            style={{
              background: `linear-gradient(45deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
            }}
          />
        ) : undefined
      }
    />
  );
}
