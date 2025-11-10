import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { loginRedirect } from "@/utils/redirects";
import { KeyManagement } from "../../../vault/components/key-management";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;
  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(team_slug, project_slug),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${team_slug}/${project_slug}/wallets/server-wallets/configuration`,
    );
  }

  if (!project) {
    redirect(`/team/${team_slug}`);
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const maskedAdminKey = projectEngineCloudService?.maskedAdminKey;
  const isManagedVault = !!projectEngineCloudService?.encryptedAdminKey;

  return (
    <KeyManagement
      maskedAdminKey={maskedAdminKey ?? undefined}
      isManagedVault={isManagedVault}
      project={project}
    />
  );
}
