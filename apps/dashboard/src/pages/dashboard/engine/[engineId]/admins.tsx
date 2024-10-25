import { EngineAdmins } from "app/team/[team_slug]/[project_slug]/engine/(instance)/[engineId]/admins/components/engine-admins";
import { createEnginePage } from "components/engine/EnginePage";

export default createEnginePage(({ instance }) => (
  <EngineAdmins instanceUrl={instance.url} />
));
