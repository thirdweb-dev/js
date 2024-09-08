import { createEnginePage } from "components/engine/EnginePage";
import { EngineAdmins } from "components/engine/permissions/engine-admins";

export default createEnginePage(({ instance }) => (
  <EngineAdmins instanceUrl={instance.url} />
));
