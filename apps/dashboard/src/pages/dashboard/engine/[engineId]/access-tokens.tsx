import { createEnginePage } from "components/engine/EnginePage";
import { EngineAccessTokens } from "components/engine/permissions/engine-access-tokens";

export default createEnginePage("access-tokens", ({ instance }) => (
  <EngineAccessTokens instanceUrl={instance.url} />
));
