import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { CreateProjectPage } from "../../../../login/onboarding/create-project-onboarding/create-project-page";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const params = await props.params;
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    notFound();
  }

  return (
    <CreateProjectPage
      enableNebulaServiceByDefault={team.enabledScopes.includes("nebula")}
      teamSlug={team.slug}
      teamId={team.id}
    />
  );
}
