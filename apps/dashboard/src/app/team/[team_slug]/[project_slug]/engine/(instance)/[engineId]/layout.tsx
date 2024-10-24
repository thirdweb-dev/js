import { EngineSidebarLayout } from "components/engine/EnginePageLayout";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    engineId: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  return (
    <div className="container">
      <EngineSidebarLayout
        engineId={params.engineId}
        rootPath={`/team/${params.team_slug}/${params.project_slug}/engine`}
      >
        {props.children}
      </EngineSidebarLayout>
    </div>
  );
}
