import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

export function RenderCode(props: {
  code: string;
  html: string;
  className?: string;
  scrollableClassName?: string;
}) {
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
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: we know what we're doing here
          dangerouslySetInnerHTML={{ __html: props.html }}
        />
      </ScrollShadow>
      <CopyButton
        text={props.code}
        iconClassName="size-3"
        className="absolute top-4 right-4 z-10 border border-border bg-background p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </div>
  );
}

function CopyButton(props: {
  text: string;
  className?: string;
  iconClassName?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <ToolTipLabel label="Copy">
      <Button
        variant="ghost"
        aria-label="Copy"
        className={cn("h-auto w-auto p-1", props.className)}
        onClick={() => {
          navigator.clipboard.writeText(props.text);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1000);
        }}
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
