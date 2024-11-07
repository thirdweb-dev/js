import { EngineInstancesList } from "./overview/engine-list";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  return <EngineInstancesList team_slug={params.team_slug} />;
}
