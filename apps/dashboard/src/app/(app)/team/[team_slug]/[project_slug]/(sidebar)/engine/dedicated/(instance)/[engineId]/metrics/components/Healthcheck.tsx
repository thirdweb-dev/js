"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { type EngineInstance, useEngineSystemHealth } from "@/hooks/useEngine";

export function Healthcheck({ instance }: { instance: EngineInstance }) {
  const query = useEngineSystemHealth(instance.url, 5_000);

  return (
    <div className="rounded-full bg-card px-3 py-2 border flex items-center gap-2">
      <PulseDot />
      {query.isSuccess ? (
        <div className="text-sm">Reachable</div>
      ) : query.isError ? (
        <div className="text-destructive-text text-sm">Not Reachable</div>
      ) : (
        <Skeleton className="h-4 w-16" />
      )}
    </div>
  );
}

function PulseDot() {
  return (
    <ToolTipLabel label="Live Data">
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
    </ToolTipLabel>
  );
}
