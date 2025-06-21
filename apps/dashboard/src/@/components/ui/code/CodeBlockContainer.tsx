"use client";

import { useClipboard } from "hooks/useClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../button";
import { ScrollShadow } from "../ScrollShadow/ScrollShadow";

export function CodeBlockContainer(props: {
  codeToCopy: string;
  children: React.ReactNode;
  className?: string;
  scrollableClassName?: string;
  scrollableContainerClassName?: string;
  copyButtonClassName?: string;
  shadowColor?: string;
  onCopy?: (code: string) => void;
}) {
  const { hasCopied, onCopy } = useClipboard(props.codeToCopy);

  return (
    <div
      className={cn(
        "group relative max-w-full overflow-hidden rounded-lg border border-border bg-card",
        props.className,
      )}
    >
      <ScrollShadow
        className={cn(
          "text-xs md:text-sm [&_*]:leading-relaxed",
          props.scrollableContainerClassName,
        )}
        scrollableClassName={cn("p-4", props.scrollableClassName)}
        shadowColor={props.shadowColor || "hsl(var(--muted))"}
      >
        {props.children}
      </ScrollShadow>

      <Button
        className={cn(
          "absolute top-3.5 right-3.5 h-auto bg-background p-2",
          props.copyButtonClassName,
        )}
        onClick={() => {
          onCopy();
          props.onCopy?.(props.codeToCopy);
        }}
        size="sm"
        variant="outline"
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
