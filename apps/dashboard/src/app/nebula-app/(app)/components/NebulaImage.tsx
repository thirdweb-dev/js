import { Img } from "@/components/blocks/Img";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { ArrowDownToLineIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { MessageActions } from "./MessageActions";

export function NebulaImage(
  props:
    | {
        type: "response";
        url: string;
        width: number;
        height: number;
        client: ThirdwebClient;
        requestId: string;
        sessionId: string | undefined;
        authToken: string;
      }
    | {
        type: "submitted";
        url: string;
        client: ThirdwebClient;
      },
) {
  const src = resolveSchemeWithErrorHandler({
    uri: props.url,
    client: props.client,
  });

  const downloadMutation = useMutation({
    mutationFn: () => downloadImage(src || ""),
  });

  if (!src) {
    return null;
  }

  return (
    <div className="group relative max-w-[80%] lg:max-w-[60%]">
      <Img
        width={props.type === "response" ? props.width : undefined}
        height={props.type === "response" ? props.height : undefined}
        src={src}
        className="w-full rounded-lg border"
        skeleton={<div className="animate-skeleton bg-muted" />}
      />
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-10 flex size-8 gap-2 rounded-lg bg-background p-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        onClick={async () => {
          downloadMutation.mutate();
        }}
      >
        {downloadMutation.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <ArrowDownToLineIcon className="size-4" />
        )}
      </Button>

      {props.type === "response" && props.sessionId && (
        <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <MessageActions
            authToken={props.authToken}
            requestId={props.requestId}
            sessionId={props.sessionId}
            messageText={undefined}
          />
        </div>
      )}
    </div>
  );
}

async function downloadImage(src: string) {
  try {
    const response = await fetch(src, { mode: "cors" });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
}
