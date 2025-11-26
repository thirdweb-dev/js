import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { ServerWalletsTable } from "../../../transactions/components/server-wallets-table.client";
import type { Wallet } from "../../../transactions/server-wallets/wallet-table/types";
import { listSolanaAccounts } from "../../../transactions/solana-wallets/lib/vault.client";
import type { SolanaWallet } from "../../../transactions/solana-wallets/wallet-table/types";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    page?: string;
    solana_page?: string;
  }>;
}) {
  const [params, searchParams, authToken] = await Promise.all([
    props.params,
    props.searchParams,
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(
      `/team/${params.team_slug}/${params.project_slug}/wallets/server-wallets`,
    );
  }

  const [vaultClient, project] = await Promise.all([
    createVaultClient({
      baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
    }).catch(() => undefined),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  if (!vaultClient) {
    return <div>Error: Failed to connect to Vault</div>;
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;

  const pageSize = 10;
  const currentPage = Number.parseInt(searchParams.page ?? "1");
  const solanaCurrentPage = Number.parseInt(searchParams.solana_page ?? "1");

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

  const wallets = (eoas.data?.items as Wallet[] | undefined) ?? [];

  let solanaAccounts: {
    data: { items: SolanaWallet[]; totalRecords: number };
    error: Error | null;
    success: boolean;
  };

  if (managementAccessToken) {
    solanaAccounts = await listSolanaAccounts({
      managementAccessToken,
      page: solanaCurrentPage,
      limit: pageSize,
      projectId: project.id,
    });
  } else {
    solanaAccounts = {
      data: { items: [], totalRecords: 0 },
      error: null,
      success: true,
    };
  }

  const isSolanaPermissionError =
    solanaAccounts.error?.message.includes("AUTH_INSUFFICIENT_SCOPE") ?? false;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <div className="flex flex-col gap-10">
      {eoas.error ? (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive font-semibold mb-2">
            EVM Wallet Error
          </p>
          <p className="text-sm text-muted-foreground">{eoas.error.message}</p>
        </div>
      ) : (
        <ServerWalletsTable
          client={client}
          evmCurrentPage={currentPage}
          evmTotalPages={Math.ceil(eoas.data.totalRecords / pageSize)}
          evmTotalRecords={eoas.data.totalRecords}
          evmWallets={wallets}
          pageSize={pageSize}
          project={project}
          solanaCurrentPage={solanaCurrentPage}
          solanaTotalPages={Math.ceil(
            solanaAccounts.data.totalRecords / pageSize,
          )}
          solanaTotalRecords={solanaAccounts.data.totalRecords}
          solanaWallets={solanaAccounts.data.items}
          teamSlug={params.team_slug}
          solanaPermissionError={isSolanaPermissionError}
          authToken={authToken}
        />
      )}
    </div>
  );
}
