import { EngineWebhooks } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/webhooks/components/engine-webhooks";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineWebhooks instanceUrl={instance.url} />
));
