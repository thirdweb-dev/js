import { EngineSidebarLayout } from "./_components/EnginePageLayout";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
    engineId: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  return (
    <EngineSidebarLayout engineId={params.engineId} teamSlug={params.team_slug}>
      {props.children}
    </EngineSidebarLayout>
  );
}
