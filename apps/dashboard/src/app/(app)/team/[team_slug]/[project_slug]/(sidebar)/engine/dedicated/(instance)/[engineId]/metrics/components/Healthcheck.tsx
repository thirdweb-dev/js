"use client";

import {
  type EngineInstance,
  useEngineSystemHealth,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { PrimaryInfoItem } from "app/(app)/(dashboard)/(chain)/[chain_id]/(chainPage)/components/server/primary-info-item";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";

export function Healthcheck({ instance }: { instance: EngineInstance }) {
  const query = useEngineSystemHealth(instance.url, 5_000);

  return (
    <>
      {/* Engine Reachability */}
      <PrimaryInfoItem title="Engine" titleIcon={<PulseDot />}>
        <div className="flex items-center gap-1">
          {query.isSuccess ? (
            <ToolTipLabel label="Working">
              <div className="text-lg text-success-text">Reachable</div>
            </ToolTipLabel>
          ) : query.isError ? (
            <ToolTipLabel label="Not Working">
              <div className="text-destructive-text text-lg">Not Reachable</div>
            </ToolTipLabel>
          ) : (
            <div className="flex h-[28px] w-[70px] py-1">
              <Skeleton className="h-full w-full" />
            </div>
          )}
        </div>
      </PrimaryInfoItem>
    </>
  );
}

function PulseDot() {
  return (
    <ToolTipLabel label="Live Data">
      <span className="relative flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex size-3 rounded-full bg-primary" />
      </span>
    </ToolTipLabel>
  );
}
