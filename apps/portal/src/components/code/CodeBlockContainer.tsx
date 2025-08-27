"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { ScrollShadow } from "@/components/ui/ScrollShadow"; // Adjusted path for portal
import { useClipboard } from "@/hooks/useClipboard"; // Adjusted path for portal
import { cn } from "@/lib/utils";
import { Button } from "../ui/button"; // Adjusted path for portal

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
  const { hasCopied, onCopy: onClipboardCopy } = useClipboard(props.codeToCopy); // Renamed onCopy to avoid conflict

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
          onClipboardCopy(); // Use renamed function
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
