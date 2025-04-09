import { getProject } from "@/api/projects";
import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { notFound } from "next/navigation";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
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

  const wallet = eoas.data?.items[0] as Wallet | undefined;

  return (
    <>
      {eoas.error ? (
        <div>Error: {eoas.error.message}</div>
      ) : (
        <div className="flex flex-col gap-8">
          <ServerWalletsTable
            wallets={eoas.data.items as Wallet[]}
            project={project}
            managementAccessToken={managementAccessToken ?? undefined}
          />
          <KeyManagement
            maskedAdminKey={maskedAdminKey ?? undefined}
            projectId={project.id}
            teamId={project.teamId}
          />
          <TryItOut authToken={authToken} wallet={wallet} />
        </div>
      )}
    </>
  );
}
