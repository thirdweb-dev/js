import type { Team } from "@/api/team";
import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { EngineFooterCard } from "../_components";
import { EngineInstancesTable } from "./engine-instances-table";

export const EngineInstancesList = (props: {
  team_slug: string;
  project_slug: string;
  instances: EngineInstance[];
  teamPlan: Team["billingPlan"];
}) => {
  const engineLinkPrefix = `/team/${props.team_slug}/${props.project_slug}/engine/dedicated`;

  return (
    <div className="flex grow flex-col">
      <EngineInstancesTable
        teamSlug={props.team_slug}
        projectSlug={props.project_slug}
        instances={props.instances}
        engineLinkPrefix={engineLinkPrefix}
        teamPlan={props.teamPlan}
      />

      <div className="h-40" />
      <EngineFooterCard
        teamPlan={props.teamPlan}
        team_slug={props.team_slug}
        project_slug={props.project_slug}
      />
    </div>
  );
};
