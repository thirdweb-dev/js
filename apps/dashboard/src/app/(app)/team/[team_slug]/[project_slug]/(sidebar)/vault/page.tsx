import { LockIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { KeyManagement } from "./components/key-management";

export default async function VaultPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;
  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(team_slug, project_slug),
  ]);

  if (!project || !authToken) {
    notFound();
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const maskedAdminKey = projectEngineCloudService?.maskedAdminKey;
  const isManagedVault = !!projectEngineCloudService?.encryptedAdminKey;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ProjectPage
      header={{
        client,
        title: "Vault",
        icon: LockIcon,
        description:
          "Secure, non-custodial key management system for your server wallets.",
        actions: null,
        links: [
          {
            type: "docs",
            href: "https://portal.thirdweb.com/vault",
          },
        ],
      }}
    >
      <KeyManagement
        maskedAdminKey={maskedAdminKey ?? undefined}
        isManagedVault={isManagedVault}
        project={project}
      />
    </ProjectPage>
  );
}
