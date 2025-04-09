import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import type { Wallet } from "./wallet-table/types.js";
import { ServerWalletsTable } from "./wallet-table/wallet-table";
import { getProject } from "@/api/projects";
import CreateServerWallet from "./components/create-server-wallet";

type EngineCloudService = {
  name: "engineCloud";
  actions: [];
  maskedAdminKey: string;
  managementAccessToken: string;
};

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
  ) as EngineCloudService | undefined;

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;

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
      <CreateServerWallet
        projectId={project.id}
        teamId={project.teamId}
        managementAccessToken={managementAccessToken}
      />

      {eoas.error ? (
        <div>Error: {eoas.error.message}</div>
      ) : (
        <ServerWalletsTable wallets={eoas.data.items as Wallet[]} />
      )}
    </>
  );
}
