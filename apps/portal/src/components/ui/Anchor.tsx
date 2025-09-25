"use client";

import { HashIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
          className="text-muted-foreground no-underline opacity-0 transition-opacity group-hover/anchor:opacity-100"
          href={`#${props.id}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <HashIcon className="size-4" />
        </a>
      )}
    </div>
  );
}
