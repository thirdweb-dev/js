import { EngineAccessTokens } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/access-tokens/components/engine-access-tokens";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineAccessTokens instanceUrl={instance.url} />
));
