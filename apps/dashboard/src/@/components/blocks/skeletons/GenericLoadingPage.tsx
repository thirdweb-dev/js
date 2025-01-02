"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";

export function GenericLoadingPage() {
  return (
    <div className="flex min-h-[500px] grow items-center justify-center rounded-lg border border-border">
      <Spinner className="size-10" />
    </div>
  );
}
