import { NebulaWaitListPage } from "../../../[project_slug]/nebula/components/nebula-waitlist-page";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;

  return (
    <NebulaWaitListPage
      redirectOnNoTeam={`/login?next=${encodeURIComponent(`/team/${params.team_slug}/~/nebula`)}`}
      teamSlug={params.team_slug}
    />
  );
}
