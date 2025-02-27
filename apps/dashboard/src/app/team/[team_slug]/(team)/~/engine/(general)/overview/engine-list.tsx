"use client";
import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { EngineInfoCard } from "../_components";
import { EngineInstancesTable } from "./engine-instances-table";

export const EngineInstancesList = (props: {
  team_slug: string;
  instances: EngineInstance[];
}) => {
  const engineLinkPrefix = `/team/${props.team_slug}/~/engine`;

  return (
    <div className="flex grow flex-col">
      <EngineInstancesTable
        instances={props.instances}
        engineLinkPrefix={engineLinkPrefix}
      />

      <div className="mt-auto pt-40">
        <EngineInfoCard team_slug={props.team_slug} />
      </div>
    </div>
  );
};
