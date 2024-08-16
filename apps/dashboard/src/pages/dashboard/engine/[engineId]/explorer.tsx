import { createEnginePage } from "components/engine/EnginePage";
import { EngineExplorer } from "components/engine/explorer/engine-explorer";

export default createEnginePage("explorer", ({ instance }) => (
  <EngineExplorer instanceUrl={instance.url} />
));
