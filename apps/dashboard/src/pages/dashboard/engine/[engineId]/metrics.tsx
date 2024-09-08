import { createEnginePage } from "components/engine/EnginePage";
import { EngineSystemMetrics } from "components/engine/system-metrics";

export default createEnginePage(({ instance }) => (
  <EngineSystemMetrics instance={instance} />
));
