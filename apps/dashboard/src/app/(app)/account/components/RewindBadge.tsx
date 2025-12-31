"use client";

import { ChevronsLeftIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RewindModal } from "../rewind/RewindModal";

export function RewindBadge({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const year = 2025; // Hardcoded to 2025

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90",
          className,
        )}
      >
        <ChevronsLeftIcon className="h-3 w-3" />
        <span>{year.toString().slice(-2)}</span>
      </button>
      <RewindModal open={open} onOpenChange={setOpen} />
    </>
  );
}
