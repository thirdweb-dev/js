"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { cn } from "@/lib/utils";

export function GenericLoadingPage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[500px] grow items-center justify-center rounded-lg border border-border",
        className,
      )}
    >
      <Spinner className="size-10" />
    </div>
  );
}
