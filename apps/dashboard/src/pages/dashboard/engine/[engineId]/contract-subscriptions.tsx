import { createEnginePage } from "components/engine/EnginePage";
import { EngineContractSubscriptions } from "components/engine/contract-subscription/engine-contract-subscription";

export default createEnginePage("contract-subscriptions", ({ instance }) => (
  <EngineContractSubscriptions instanceUrl={instance.url} />
));
