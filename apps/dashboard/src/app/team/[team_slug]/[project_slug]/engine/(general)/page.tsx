import { EngineInstancesList } from "../../../../../../components/engine/engine-list";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    engineId: string;
  }>;
}) {
  return (
    <EngineInstancesList
      engineLinkPrefix={`/team/${(await props.params).team_slug}/${(await props.params).project_slug}/engine`}
    />
  );
}
