"use client";

import { useClipboard } from "hooks/useClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export function PlainTextCodeBlock(props: {
  code: string;
  copyButtonClassName?: string;
}) {
  const { hasCopied, onCopy } = useClipboard(props.code);

  return (
    <div className="relative">
      <code className="block whitespace-pre rounded-lg border border-border bg-muted/50 p-4">
        {props.code}
      </code>
      <Button
        size="sm"
        variant="outline"
        onClick={onCopy}
        className={cn(
          "absolute top-3.5 right-3.5 h-auto p-2",
          props.copyButtonClassName,
        )}
      >
        {hasCopied ? (
          <CheckIcon className="size-3 text-green-500" />
        ) : (
          <CopyIcon className="size-3 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
