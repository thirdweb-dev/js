import { EngineSidebarLayout } from "components/engine/EnginePageLayout";

export default function Layout(props: {
  params: {
    team_slug: string;
    project_slug: string;
    engineId: string;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <EngineSidebarLayout
        engineId={props.params.engineId}
        rootPath={`/team/${props.params.team_slug}/${props.params.project_slug}/engine`}
      >
        {props.children}
      </EngineSidebarLayout>
    </div>
  );
}
