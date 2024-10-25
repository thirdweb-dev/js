import { EngineAlertsPage } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/alerts/components/EngineAlertsPage";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineAlertsPage instance={instance} />
));
