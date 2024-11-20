"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function BlueprintsPageHeader() {
  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
            Insight
          </h1>
          <Button
            className="w-full cursor-not-allowed gap-2 opacity-50 sm:w-auto"
            disabled
          >
            <PlusIcon className="size-4" />
            Create Blueprint (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );
}
