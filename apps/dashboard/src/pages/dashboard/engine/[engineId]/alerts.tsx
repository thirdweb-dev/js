import { createEnginePage } from "components/engine/EnginePage";
import { EngineAlertsPage } from "../../../../components/engine/alerts/EngineAlertsPage";

export default createEnginePage(({ instance }) => (
  <EngineAlertsPage instance={instance} />
));
