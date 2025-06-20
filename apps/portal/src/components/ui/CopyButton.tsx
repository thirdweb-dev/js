"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClipboard } from "../../hooks/useClipboard";
import { Button } from "./button";
import { ToolTipLabel } from "./tooltip";

export function CopyButton(props: {
  text: string;
  className?: string;
  iconClassName?: string;
  variant?: "ghost" | "primary" | "secondary";
}) {
  const { hasCopied, onCopy } = useClipboard(props.text, 1000);
  return (
    <ToolTipLabel label="Copy">
      <Button
        aria-label="Copy"
        className={cn("h-auto w-auto p-1", props.className)}
        onClick={onCopy}
        variant={props.variant || "ghost"}
      >
        {hasCopied ? (
          <CheckIcon
            className={cn("size-4 text-green-500", props.iconClassName)}
          />
        ) : (
          <CopyIcon
            className={cn("size-4 text-muted-foreground", props.iconClassName)}
          />
        )}
      </Button>
    </ToolTipLabel>
  );
}
