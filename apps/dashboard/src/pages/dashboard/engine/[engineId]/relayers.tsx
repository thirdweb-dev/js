import { EngineRelayer } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/relayers/components/engine-relayer";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineRelayer instanceUrl={instance.url} />
));
