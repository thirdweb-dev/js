export type EngineInstancePageProps = {
  params: Promise<{
    team_slug: string;
    project_slug: string;
    engineId: string;
  }>;
};
