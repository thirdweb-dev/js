import type { Team } from "@/api/team/get-team";
import type { EngineInstance } from "@/hooks/useEngine";
import { EngineFooterCard } from "../_components";
import { EngineInstancesTable } from "./engine-instances-table";

export const EngineInstancesList = (props: {
  team: Team;
  projectSlug: string;
  instances: EngineInstance[];
}) => {
  const engineLinkPrefix = `/team/${props.team.slug}/${props.projectSlug}/engine`;

  return (
    <div className="flex grow flex-col gap-12">
      <EngineInstancesTable
        engineLinkPrefix={engineLinkPrefix}
        instances={props.instances}
        projectSlug={props.projectSlug}
        team={props.team}
      />

      <EngineFooterCard
        projectSlug={props.projectSlug}
        teamSlug={props.team.slug}
      />
    </div>
  );
};
