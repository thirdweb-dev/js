import { createEnginePage } from "components/engine/EnginePage";
import { EngineSystemMetrics } from "components/engine/system-metrics";

export default createEnginePage("metrics", ({ instance }) => (
  <EngineSystemMetrics instance={instance} />
));
