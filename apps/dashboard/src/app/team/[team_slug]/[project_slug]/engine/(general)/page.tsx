import { EngineInstancesList } from "../../../../../../components/engine/engine-list";

export default function Page(props: {
  params: {
    team_slug: string;
    project_slug: string;
    engineId: string;
  };
}) {
  return (
    <EngineInstancesList
      engineLinkPrefix={`/team/${props.params.team_slug}/${props.params.project_slug}/engine`}
    />
  );
}
