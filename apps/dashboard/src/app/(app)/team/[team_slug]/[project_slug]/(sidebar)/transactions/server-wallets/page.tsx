import { getProject } from "@/api/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "@app/api/lib/getAuthToken";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { notFound } from "next/navigation";
import type { Wallet } from "./wallet-table/types";
import { ServerWalletsTable } from "./wallet-table/wallet-table";

export default async function TransactionsServerWalletsPage(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const vaultClient = await createVaultClient({
    baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
  });

  const { team_slug, project_slug } = await props.params;
  const { page } = await props.searchParams;
  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(team_slug, project_slug),
  ]);

  if (!project || !authToken) {
    notFound();
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;

  const pageSize = 10;
  const currentPage = Number.parseInt(page ?? "1");
  const eoas = managementAccessToken
    ? await listEoas({
        client: vaultClient,
        request: {
          auth: {
            accessToken: managementAccessToken,
          },
          options: {
            page: currentPage - 1,
            // @ts-expect-error - TODO: fix this
            page_size: pageSize,
          },
        },
      })
    : { data: { items: [], totalRecords: 0 }, error: null, success: true };

  return (
    <>
      {eoas.error ? (
        <div>Error: {eoas.error.message}</div>
      ) : (
        <div className="flex flex-col gap-8">
          <ServerWalletsTable
            client={client}
            wallets={eoas.data.items as Wallet[]}
            totalRecords={eoas.data.totalRecords}
            currentPage={currentPage}
            totalPages={Math.ceil(eoas.data.totalRecords / pageSize)}
            project={project}
            teamSlug={team_slug}
            managementAccessToken={managementAccessToken ?? undefined}
          />
        </div>
      )}
    </>
  );
}
