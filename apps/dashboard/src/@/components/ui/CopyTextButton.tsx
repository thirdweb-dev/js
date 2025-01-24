"use client";

import { cn } from "@/lib/utils";
import { useClipboard } from "hooks/useClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "./button";
import { ToolTipLabel } from "./tooltip";

export function CopyTextButton(props: {
  textToShow: string;
  textToCopy: string;
  tooltip: string | undefined;
  className?: string;
  iconClassName?: string;
  variant?:
    | "primary"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  copyIconPosition: "left" | "right";
  onClick?: () => void;
}) {
  const { hasCopied, onCopy } = useClipboard(props.textToCopy, 1000);
  const copyButton = hasCopied ? (
    <CheckIcon
      className={cn("size-3 shrink-0 text-green-500", props.iconClassName)}
    />
  ) : (
    <CopyIcon
      className={cn(
        "size-3 shrink-0 text-muted-foreground",
        props.iconClassName,
      )}
    />
  );

  return (
    <ToolTipLabel label={props.tooltip}>
      <Button
        variant={props.variant || "outline"}
        aria-label={props.tooltip}
        className={cn(
          "flex h-auto w-auto gap-2 rounded-lg px-2.5 py-1.5 font-normal text-foreground",
          props.className,
        )}
        onClick={(e) => {
          onCopy();
          e.stopPropagation();
          props.onClick?.();
        }}
      >
        {props.copyIconPosition === "right" ? (
          <>
            <span className="min-w-0 truncate"> {props.textToShow} </span>
            {copyButton}
          </>
        ) : (
          <>
            {copyButton}
            <span className="min-w-0 truncate"> {props.textToShow} </span>
          </>
        )}
      </Button>
    </ToolTipLabel>
  );
}
