import { Img } from "@/components/blocks/Img";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const src = props.url.startsWith("ipfs://")
    ? resolveSchemeWithErrorHandler({
        uri: props.url,
        client: props.client,
      })
    : props.url;

  const downloadMutation = useMutation({
    mutationFn: () => downloadImage(src || ""),
  });

  if (!src) {
    return null;
  }

  return (
    <div className="group relative w-full max-w-[80%] lg:max-w-[50%]">
      <Dialog>
        <DialogTrigger asChild>
          <Img
            width={props.type === "response" ? props.width : undefined}
            height={props.type === "response" ? props.height : undefined}
            src={src}
            className="w-full rounded-lg border hover:border-active-border"
            skeleton={
              <div className="min-h-[300px] animate-skeleton bg-muted" />
            }
          />
        </DialogTrigger>

        <DialogContent
          className="!w-full !max-w-[800px] p-2"
          dialogCloseClassName="focus:ring-offset-0 focus:ring-transparent"
        >
          <DialogTitle className="sr-only">Image</DialogTitle>
          <Img
            src={src}
            className="h-full w-full object-contain"
            skeleton={<div className="animate-skeleton bg-muted" />}
          />
        </DialogContent>
      </Dialog>

      <div className="absolute top-4 right-4 z-10 flex justify-between gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="size-8 gap-2 rounded-lg bg-background/50 p-0 "
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
      </div>

      {props.type === "response" && props.sessionId && (
        <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <MessageActions
            authToken={props.authToken}
            requestId={props.requestId}
            sessionId={props.sessionId}
            messageText={undefined}
            buttonClassName="bg-background/50 border-none"
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
