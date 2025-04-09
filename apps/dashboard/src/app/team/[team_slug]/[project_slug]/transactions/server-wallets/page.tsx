import { getProject } from "@/api/projects";
import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { KeyManagement } from "./components/key-management";
import { TryItOut } from "./components/try-it-out";
import type { Wallet } from "./wallet-table/types";
import { ServerWalletsTable } from "./wallet-table/wallet-table";

export default async function TransactionsServerWalletsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const vaultClient = await createVaultClient({
    baseUrl: THIRDWEB_VAULT_URL,
  });

  const { team_slug, project_slug } = await props.params;

  const project = await getProject(team_slug, project_slug);

  const projectEngineCloudService = project?.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;
  const maskedAdminKey = projectEngineCloudService?.maskedAdminKey;

  const eoas = managementAccessToken
    ? await listEoas({
        client: vaultClient,
        request: {
          auth: {
            accessToken: managementAccessToken,
          },
          options: {},
        },
      })
    : { data: { items: [] }, error: null, success: true };

  if (!project) {
    return <div>Error: Project not found</div>;
  }

  return (
    <>
      {eoas.error ? (
        <div>Error: {eoas.error.message}</div>
      ) : (
        <div className="flex flex-col gap-8">
          <ServerWalletsTable
            wallets={eoas.data.items as Wallet[]}
            projectId={project.id}
            teamId={project.teamId}
            managementAccessToken={managementAccessToken ?? undefined}
          />
          <KeyManagement
            maskedAdminKey={maskedAdminKey ?? undefined}
            projectId={project.id}
            teamId={project.teamId}
          />
          <TryItOut />
        </div>
      )}
    </>
  );
}
