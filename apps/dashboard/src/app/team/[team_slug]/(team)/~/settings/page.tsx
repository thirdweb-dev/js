import { getTeamBySlug } from "@/api/team";

export default async function TeamSettingsPage(props: {
  params: { team_slug: string };
}) {
  const team = await getTeamBySlug(props.params.team_slug);

  if (!team) {
    // should never be hit, because layout should redirect to 404
    return <div>404</div>;
  }

  return (
    <>
      <div className="py-8 bg-card border-b">
        <div className="container">
          <h2 className="font-medium text-3xl tracking-tight">Settings</h2>
        </div>
      </div>
    </>
  );
}
