import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { getAuthToken } from "../../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../../login/loginRedirect";
import { EcosystemPermissionsPage } from "./configuration/components/client/EcosystemPermissionsPage";

export default async function Page(props: {
  params: Promise<{ slug: string; team_slug: string }>;
}) {
  const params = await props.params;
  const [authToken, team] = await Promise.all([
    getAuthToken(),
    getTeamBySlug(params.team_slug),
  ]);

  if (!team) {
    notFound();
  }

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/ecosystem/${params.slug}`);
  }

  return (
    <EcosystemPermissionsPage
      params={params}
      authToken={authToken}
      teamId={team.id}
    />
  );
}
