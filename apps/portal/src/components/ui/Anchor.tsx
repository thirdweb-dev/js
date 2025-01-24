"use client";

import { cn } from "@/lib/utils";
import { Link as LinkIcon } from "lucide-react";

export function Anchor(props: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/anchor flex scroll-mt-offset-top-mobile items-center gap-2 xl:scroll-mt-offset-top",
        props.className,
      )}
      id={props.id}
    >
      {props.children}
      {props.id && (
        <a
          href={`#${props.id}`}
          className="text-muted-foreground no-underline opacity-0 transition-opacity group-hover/anchor:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <LinkIcon className="size-4" />
        </a>
      )}
    </div>
  );
}
