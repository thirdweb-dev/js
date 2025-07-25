"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ToolTipLabel } from "./tooltip";

export function CopyButton(props: {
  text: string;
  label?: string;
  className?: string;
  iconClassName?: string;
  tooltip?: boolean;
  variant?: "ghost" | "primary" | "secondary" | "default" | "outline";
}) {
  const { hasCopied, onCopy } = useClipboard(props.text, 1000);
  const showTooltip = props.tooltip ?? true;

  const button = (
    <Button
      aria-label="Copy"
      className={cn(
        "h-auto w-auto flex items-center gap-2 text-muted-foreground",
        props.label ? "p-2" : "p-1",
        props.className,
      )}
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
      {props.label}
    </Button>
  );

  if (!showTooltip) {
    return button;
  }

  return <ToolTipLabel label="Copy">{button}</ToolTipLabel>;
}
