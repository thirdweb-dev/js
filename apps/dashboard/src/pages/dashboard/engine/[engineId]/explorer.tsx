import { EngineExplorer } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/explorer/components/engine-explorer";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineExplorer instanceUrl={instance.url} />
));
