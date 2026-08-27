import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { loginRedirect } from "@/utils/redirects";
import { ServerWalletsTable } from "../../../transactions/components/server-wallets-table.client";
import {
  listEvmServerWallets,
  type ServerWalletList,
} from "../../../transactions/lib/server-wallets";
import {
  listSolanaAccounts,
  type SolanaWalletList,
} from "../../../transactions/solana-wallets/lib/vault.client";
import { VaultRecoveryCard } from "./vault-recovery-card.client";

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

  const project = await getProject(params.team_slug, params.project_slug);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;

  const pageSize = 10;
  const currentPage = Number.parseInt(searchParams.page ?? "1");
  const solanaCurrentPage = Number.parseInt(searchParams.solana_page ?? "1");

  const emptyEvmList: ServerWalletList = {
    data: { items: [], totalRecords: 0 },
    error: null,
    success: true,
  };
  const emptySolanaList: SolanaWalletList = {
    data: { items: [], totalRecords: 0 },
    error: null,
    success: true,
  };

  const [eoas, solanaAccounts] = managementAccessToken
    ? await Promise.all([
        listEvmServerWallets({
          limit: pageSize,
          page: currentPage,
          projectId: project.id,
          teamId: project.teamId,
        }),
        listSolanaAccounts({
          limit: pageSize,
          page: solanaCurrentPage,
          projectId: project.id,
          teamId: project.teamId,
        }),
      ])
    : [emptyEvmList, emptySolanaList];

  const wallets = eoas.data.items;

  const isSolanaPermissionError =
    solanaAccounts.error?.message.includes("AUTH_INSUFFICIENT_SCOPE") ?? false;

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <div className="flex flex-col gap-10">
      {eoas.error ? (
        <VaultRecoveryCard
          errorMessage={eoas.error.message}
          project={project}
        />
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
