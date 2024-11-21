import type { EngineInstancePageProps } from "../types";
import { EngineAdminsPage } from "./admins-page.client";

export default async function Page(props: EngineInstancePageProps) {
  const params = await props.params;
  return (
    <EngineAdminsPage engineId={params.engineId} team_slug={params.team_slug} />
  );
}
