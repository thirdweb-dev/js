import { createEnginePage } from "components/engine/EnginePage";
import { EngineAccessTokens } from "components/engine/permissions/engine-access-tokens";

export default createEnginePage(({ instance }) => (
  <EngineAccessTokens instanceUrl={instance.url} />
));
