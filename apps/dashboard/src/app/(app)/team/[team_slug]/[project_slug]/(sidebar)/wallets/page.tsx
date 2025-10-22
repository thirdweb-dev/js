import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import { redirect } from "next/navigation";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { getAuthToken } from "@/api/auth-token";
import { getProject } from "@/api/project/projects";
import type { DurationId } from "@/components/analytics/date-range-selector";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { InAppWalletUsersPageContent } from "@/components/in-app-wallet-users-content/in-app-wallet-users-content";
import { NEXT_PUBLIC_THIRDWEB_VAULT_URL } from "@/constants/public-envs";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { getFiltersFromSearchParams } from "@/lib/time";
import { loginRedirect } from "@/utils/redirects";
import { ServerWalletsTable } from "../transactions/components/server-wallets-table.client";
import type { Wallet } from "../transactions/server-wallets/wallet-table/types";
import { listSolanaAccounts } from "../transactions/solana-wallets/lib/vault.client";
import type { SolanaWallet } from "../transactions/solana-wallets/wallet-table/types";
import { InAppWalletAnalytics } from "./analytics/chart";
import { InAppWalletsSummary } from "./analytics/chart/Summary";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
    page?: string;
    solana_page?: string;
  }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const authToken = await getAuthToken();
  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/wallets`);
  }

  const defaultRange: DurationId = "last-30";
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange,
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  const [vaultClient, project] = await Promise.all([
    createVaultClient({
      baseUrl: NEXT_PUBLIC_THIRDWEB_VAULT_URL,
    }).catch(() => undefined),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const projectEngineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  const managementAccessToken =
    projectEngineCloudService?.managementAccessToken;

  // Fetch server wallets with pagination (5 per page)
  const pageSize = 5;
  const currentPage = Number.parseInt(searchParams.page ?? "1");
  const solanCurrentPage = Number.parseInt(searchParams.solana_page ?? "1");

  // Fetch EVM wallets
  const eoas =
    vaultClient && managementAccessToken
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

  // Fetch Solana wallets
  let solanaAccounts: {
    data: { items: SolanaWallet[]; totalRecords: number };
    error: Error | null;
    success: boolean;
  };

  if (managementAccessToken) {
    solanaAccounts = await listSolanaAccounts({
      managementAccessToken,
      page: solanCurrentPage,
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

  // Check for Solana permission errors
  const isSolanaPermissionError = solanaAccounts.error?.message?.includes(
    "AUTH_INSUFFICIENT_SCOPE",
  );

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <ProjectPage
        header={{
          icon: WalletProductIcon,
          client,
          title: "Wallets",
          description: (
            <>
              Create wallets for your users with flexible authentication
              options.
              <br className="max-sm:hidden" /> Choose from email/phone
              verification, OAuth, passkeys, or external wallet connections
            </>
          ),
          actions: null,
          settings: {
            href: `/team/${params.team_slug}/${params.project_slug}/settings/wallets`,
          },
          links: [
            {
              type: "docs",
              href: "https://portal.thirdweb.com/wallets",
            },
            {
              type: "playground",
              href: "https://playground.thirdweb.com/wallets/in-app-wallet",
            },
            {
              type: "api",
              href: "https://api.thirdweb.com/reference#tag/wallets",
            },
          ],
        }}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <ResponsiveTimeFilters defaultRange={defaultRange} />
          <InAppWalletsSummary
            projectId={project.id}
            teamId={project.teamId}
            authToken={authToken}
            range={range}
          />

          <InAppWalletAnalytics
            interval={interval}
            projectId={project.id}
            range={range}
            teamId={project.teamId}
            authToken={authToken}
          />

          {/* Server Wallets Section (EVM + Solana) */}
          <div className="flex flex-col gap-4">
            {eoas.error ? (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-destructive font-semibold mb-2">
                  EVM Wallet Error
                </p>
                <p className="text-sm text-muted-foreground">
                  {eoas.error.message || "Failed to load EVM wallets"}
                </p>
              </div>
            ) : (
              <ServerWalletsTable
                client={client}
                evmCurrentPage={currentPage}
                evmTotalPages={Math.ceil(eoas.data.totalRecords / pageSize)}
                evmTotalRecords={eoas.data.totalRecords}
                evmWallets={eoas.data.items as Wallet[]}
                project={project}
                solanaCurrentPage={solanCurrentPage}
                solanaTotalPages={Math.ceil(
                  solanaAccounts.data.totalRecords / pageSize,
                )}
                solanaTotalRecords={solanaAccounts.data.totalRecords}
                solanaWallets={solanaAccounts.data.items}
                teamSlug={params.team_slug}
                solanaPermissionError={isSolanaPermissionError || false}
              />
            )}
          </div>

          {/* User Wallets Section */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-2xl tracking-tight">
              User wallets
            </h2>
            <InAppWalletUsersPageContent
              authToken={authToken}
              client={client}
              projectClientId={project.publishableKey}
              teamId={project.teamId}
            />
          </div>
        </div>
      </ProjectPage>
    </ResponsiveSearchParamsProvider>
  );
}
