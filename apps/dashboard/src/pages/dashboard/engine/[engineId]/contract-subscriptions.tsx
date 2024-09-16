import { createEnginePage } from "components/engine/EnginePage";
import { EngineContractSubscriptions } from "components/engine/contract-subscription/engine-contract-subscription";

export default createEnginePage(({ instance }) => (
  <EngineContractSubscriptions instanceUrl={instance.url} />
));
