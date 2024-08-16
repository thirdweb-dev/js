import { createEnginePage } from "components/engine/EnginePage";
import { EngineWebhooks } from "components/engine/configuration/engine-webhooks";

export default createEnginePage("webhooks", ({ instance }) => (
  <EngineWebhooks instanceUrl={instance.url} />
));
