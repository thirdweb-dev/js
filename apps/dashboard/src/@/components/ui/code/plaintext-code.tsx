"use client";

import { cn } from "@/lib/utils";
import { useClipboard } from "hooks/useClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { ScrollShadow } from "../ScrollShadow/ScrollShadow";
import { Button } from "../button";

export function PlainTextCodeBlock(props: {
  code: string;
  copyButtonClassName?: string;
  className?: string;
  scrollableClassName?: string;
  codeClassName?: string;
}) {
  const { hasCopied, onCopy } = useClipboard(props.code);

  return (
    <div
      className={cn(
        "group relative max-w-full overflow-hidden rounded-lg border border-border bg-background",
        props.className,
      )}
    >
      <ScrollShadow
        scrollableClassName={cn("p-4", props.scrollableClassName)}
        className="text-xs md:text-sm [&_*]:leading-relaxed"
        shadowColor="hsl(var(--muted))"
      >
        <code className={cn("block whitespace-pre", props.codeClassName)}>
          {props.code}
        </code>
      </ScrollShadow>

      <Button
        size="sm"
        variant="outline"
        onClick={onCopy}
        className={cn(
          "absolute top-3.5 right-3.5 h-auto bg-background p-2",
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
