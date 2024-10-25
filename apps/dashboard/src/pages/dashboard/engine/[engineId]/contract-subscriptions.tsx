import { EngineContractSubscriptions } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/contract-subscriptions/components/engine-contract-subscription";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineContractSubscriptions instanceUrl={instance.url} />
));
