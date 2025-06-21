"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ToolTipLabel } from "./tooltip";

export function CopyButton(props: {
  text: string;
  className?: string;
  iconClassName?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <ToolTipLabel label="Copy">
      <Button
        aria-label="Copy"
        className={cn("h-auto w-auto p-1", props.className)}
        onClick={() => {
          navigator.clipboard.writeText(props.text);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1000);
        }}
        variant="ghost"
      >
        {isCopied ? (
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
