import { createEnginePage } from "components/engine/EnginePage";
import { EngineOverview } from "components/engine/overview/engine-overview";

export default createEnginePage(({ instance }) => (
  <EngineOverview instance={instance} />
));
