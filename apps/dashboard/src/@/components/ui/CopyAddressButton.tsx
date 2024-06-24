"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { ToolTipLabel } from "./tooltip";

export function CopyAddressButton(props: {
  address: string;
  className?: string;
  iconClassName?: string;
  variant?:
    | "primary"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
}) {
  const [isCopied, setIsCopied] = useState(false);
  const shortenedAddress = `${props.address.slice(0, 6)}...${props.address.slice(0, 4)}`;

  return (
    <ToolTipLabel label="Copy address">
      <Button
        variant={props.variant || "outline"}
        aria-label="Copy"
        className={cn(
          "h-auto w-auto px-2.5 py-1.5 flex gap-2 text-xs rounded-lg font-mono text-foreground",
          props.className,
        )}
        onClick={() => {
          navigator.clipboard.writeText(props.address);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1000);
        }}
      >
        {isCopied ? (
          <CheckIcon
            className={cn("size-3 text-green-500", props.iconClassName)}
          />
        ) : (
          <CopyIcon
            className={cn("size-3 text-muted-foreground", props.iconClassName)}
          />
        )}
        {shortenedAddress}
      </Button>
    </ToolTipLabel>
  );
}
