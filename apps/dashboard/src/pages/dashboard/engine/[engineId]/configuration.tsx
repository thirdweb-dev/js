import { EngineConfiguration } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/configuration/components/engine-configuration";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineConfiguration instance={instance} />
));
