import { getProject } from "@/api/projects";
import { getTeamBySlug } from "@/api/team";
import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { createVaultClient } from "@thirdweb-dev/vault-sdk";
import { redirect } from "next/navigation";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { getEngineInstances } from "./dedicated/_utils/getEngineInstances";

export default async function TransactionsAnalyticsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string | string[] | undefined;
    to?: string | string[] | undefined;
    interval?: string | string[] | undefined;
  }>;
}) {
  const { team_slug, project_slug } = await props.params;
  const authToken = await getAuthToken();

  if (!authToken) {
    redirect("/team");
  }

  const [team, project, engineInstances] = await Promise.all([
    getTeamBySlug(team_slug),
    getProject(team_slug, project_slug),
    getEngineInstances({ authToken, teamIdOrSlug: team_slug }),
  ]);

  if (!team) {
    redirect("/team");
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const vaultClient = await createVaultClient({
    baseUrl: THIRDWEB_VAULT_URL,
  }).catch(() => undefined);

  if (!vaultClient) {
    return <div>Error: Failed to connect to Vault</div>;
  }

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;

  // if we have a management access token, redirect to the engine cloud layout
  if (managementAccessToken) {
    redirect(`/team/${team_slug}/${project_slug}/engine/cloud`);
  }

  // if we have any legacy engine instances, redirect to the legacy engine layout
  if (engineInstances.data?.length && engineInstances.data.length > 0) {
    redirect(`/team/${team_slug}/${project_slug}/engine/dedicated`);
  }

  // otherwise, redirect to the engine cloud layout
  redirect(`/team/${team_slug}/${project_slug}/engine/cloud`);
}
