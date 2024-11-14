import { NebulaWaitListPage } from "./components/nebula-waitlist-page";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
    project_slug: string;
  }>;
}) {
  const params = await props.params;

  return (
    <NebulaWaitListPage
      redirectOnNoTeam={`/login?next=${encodeURIComponent(`/team/${params.team_slug}/${params.project_slug}/nebula`)}`}
      teamSlug={params.team_slug}
    />
  );
}
