import { createEnginePage } from "components/engine/EnginePage";
import { EngineConfiguration } from "components/engine/configuration/engine-configuration";

export default createEnginePage("configuration", ({ instance }) => (
  <EngineConfiguration instance={instance} />
));
