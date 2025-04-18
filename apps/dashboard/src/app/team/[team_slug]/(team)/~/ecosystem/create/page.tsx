import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { EcosystemCreatePage } from "./EcosystemCreatePage";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;
  const team = await getTeamBySlug(team_slug);

  if (!team) {
    return notFound();
  }

  return <EcosystemCreatePage teamSlug={team_slug} teamId={team.id} />;
}
