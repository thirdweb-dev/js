"use client";
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ToolTipLabel } from "./tooltip";

export function LinkWithCopyButton(props: {
  href: string;
  textToShow: string;
  textToCopy: string;
  copyTooltip: string;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <div className={cn("flex items-center gap-1", props.className)}>
      <ToolTipLabel label={props.copyTooltip}>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto shrink-0 opacity-70 hover:opacity-100 text-muted-foreground"
          onClick={() => {
            navigator.clipboard.writeText(props.textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
          }}
        >
          <Icon className="size-3" />
        </Button>
      </ToolTipLabel>
      <Link
        href={props.href}
        target="_blank"
        className="text-sm text-muted-foreground hover:underline flex items-center gap-1 tabular-nums flex-1 truncate hover:text-foreground group"
      >
        <span className="max-w-full truncate">{props.textToShow}</span>
        <ArrowUpRightIcon className="size-3.5 opacity-70 shrink-0 group-hover:opacity-100" />
      </Link>
    </div>
  );
}
