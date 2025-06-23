import type { Team } from "@/api/team";
import type { EngineInstance } from "@/hooks/useEngine";
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
        engineLinkPrefix={engineLinkPrefix}
        instances={props.instances}
        projectSlug={props.projectSlug}
        team={props.team}
      />

      <div className="h-40" />
      <EngineFooterCard
        projectSlug={props.projectSlug}
        teamSlug={props.team.slug}
      />
    </div>
  );
};
