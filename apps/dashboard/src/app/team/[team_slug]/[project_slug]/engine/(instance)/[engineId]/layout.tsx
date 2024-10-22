import { EngineSidebarLayout } from "components/engine/EnginePageLayout";

export default async function Layout(
  props: {
    params: Promise<{
      team_slug: string;
      project_slug: string;
      engineId: string;
    }>;
    children: React.ReactNode;
  }
) {
  return (
    (<div className="container">
      <EngineSidebarLayout
        engineId={(await props.params).engineId}
        rootPath={`/team/${(await props.params).team_slug}/${(await props.params).project_slug}/engine`}
      >
        {props.children}
      </EngineSidebarLayout>
    </div>)
  );
}
