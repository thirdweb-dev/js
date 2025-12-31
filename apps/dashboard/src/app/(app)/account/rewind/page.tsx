"use client";

import { Button } from "@workspace/ui/components/button";
import { SparklesIcon } from "lucide-react";
import { useState } from "react";
import { RewindModal } from "./RewindModal";

export default function RewindPage() {
  const [open, setOpen] = useState(true);
  const displayYear = 2025;

  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <SparklesIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {displayYear} Year in Review
          </span>
        </div>
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Your thirdweb Rewind
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          A look back at your journey building on web3 this year
        </p>
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="text-lg px-8 py-6"
        >
          View Your Rewind
        </Button>
      </div>

      <RewindModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
