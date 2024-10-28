import { EngineSystemMetrics } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/metrics/components/EngineSystemMetrics";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineSystemMetrics instance={instance} />
));
