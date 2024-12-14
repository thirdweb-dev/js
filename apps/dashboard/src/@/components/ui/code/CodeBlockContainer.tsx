"use client";

import { cn } from "@/lib/utils";
import { useClipboard } from "hooks/useClipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { ScrollShadow } from "../ScrollShadow/ScrollShadow";
import { Button } from "../button";

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
        "group relative max-w-full overflow-hidden rounded-lg border border-border bg-background",
        props.className,
      )}
    >
      <ScrollShadow
        scrollableClassName={cn("p-4", props.scrollableClassName)}
        className={cn(
          "text-xs md:text-sm [&_*]:leading-relaxed",
          props.scrollableContainerClassName,
        )}
        shadowColor={props.shadowColor || "hsl(var(--muted))"}
      >
        {props.children}
      </ScrollShadow>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          onCopy();
          props.onCopy?.(props.codeToCopy);
        }}
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
