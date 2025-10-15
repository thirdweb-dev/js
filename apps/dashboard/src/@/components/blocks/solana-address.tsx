"use client";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";

export function SolanaAddress(props: {
  address: string;
  shortenAddress?: boolean;
  className?: string;
}) {
  const shortenedAddress = useMemo(() => {
    return props.shortenAddress !== false
      ? `${props.address.slice(0, 4)}...${props.address.slice(-4)}`
      : props.address;
  }, [props.address, props.shortenAddress]);

  const lessShortenedAddress = useMemo(() => {
    return `${props.address.slice(0, 8)}...${props.address.slice(-8)}`;
  }, [props.address]);

  const { onCopy, hasCopied } = useClipboard(props.address, 2000);

  return (
    <HoverCard>
      <HoverCardTrigger asChild tabIndex={-1}>
        <Button
          className={cn(
            "flex flex-row items-center gap-2 px-0",
            props.className,
          )}
          onClick={(e) => e.stopPropagation()}
          variant="link"
        >
          <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
          <span className="cursor-pointer font-mono text-sm">
            {shortenedAddress}
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 border-border"
        onClick={(e) => {
          // do not close the hover card when clicking anywhere in the content
          e.stopPropagation();
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Solana Public Key</h3>
            <Button
              className="flex items-center gap-2"
              onClick={onCopy}
              size="sm"
              variant="outline"
            >
              {hasCopied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="break-all rounded bg-muted p-3 text-center font-mono text-xs leading-relaxed">
            {lessShortenedAddress}
          </p>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Solana public key for blockchain transactions.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
