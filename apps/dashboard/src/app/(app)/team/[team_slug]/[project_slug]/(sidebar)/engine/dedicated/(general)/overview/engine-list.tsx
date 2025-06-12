import type { Team } from "@/api/team";
import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { EngineFooterCard } from "../_components";
import { EngineInstancesTable } from "./engine-instances-table";

export const EngineInstancesList = (props: {
  team: Team;
  projectSlug: string;
  instances: EngineInstance[];
}) => {
  const engineLinkPrefix = `/team/${props.team.slug}/${props.projectSlug}/engine/dedicated`;

  return (
    <div className="flex grow flex-col">
      <EngineInstancesTable
        team={props.team}
        projectSlug={props.projectSlug}
        instances={props.instances}
        engineLinkPrefix={engineLinkPrefix}
      />

      <div className="h-40" />
      <EngineFooterCard
        teamSlug={props.team.slug}
        projectSlug={props.projectSlug}
      />
    </div>
  );
};
