"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type EngineInstance,
  useEngineSystemHealth,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { PrimaryInfoItem } from "app/(dashboard)/(chain)/[chain_id]/(chainPage)/components/server/primary-info-item";

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
              <div className="text-lg text-destructive-text">Not Reachable</div>
            </ToolTipLabel>
          ) : (
            <div className="flex py-1 h-[28px] w-[70px]">
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
    <ToolTipLabel label={"Live Data"}>
      <span className="relative flex size-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex rounded-full size-3 bg-primary" />
      </span>
    </ToolTipLabel>
  );
}
