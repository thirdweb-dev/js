import { createEnginePage } from "components/engine/EnginePage";
import { EngineRelayer } from "components/engine/relayer/engine-relayer";

export default createEnginePage("relayers", ({ instance }) => (
  <EngineRelayer instanceUrl={instance.url} />
));
