"use client";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  type EngineInstance,
  useEngineBackendWallets,
  useEngineWalletConfig,
} from "@/hooks/useEngine";
import { BackendWalletsTable } from "./backend-wallets-table";
import { CreateBackendWalletButton } from "./create-backend-wallet-button";
import { ImportBackendWalletButton } from "./import-backend-wallet-button";
import { TransactionCharts, TransactionsTable } from "./transactions-table";

interface EngineOverviewProps {
  instance: EngineInstance;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
  client: ThirdwebClient;
}

export const EngineOverview: React.FC<EngineOverviewProps> = ({
  instance,
  teamSlug,
  projectSlug,
  authToken,
  client,
}) => {
  return (
    <div>
      <BackendWalletsSection
        authToken={authToken}
        client={client}
        instance={instance}
        projectSlug={projectSlug}
        teamSlug={teamSlug}
      />
      <div className="h-10" />
      <TransactionCharts authToken={authToken} instanceUrl={instance.url} />
      <div className="h-10" />
      <TransactionsTable
        authToken={authToken}
        client={client}
        instanceUrl={instance.url}
      />
    </div>
  );
};

function BackendWalletsSection(props: {
  instance: EngineInstance;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
  client: ThirdwebClient;
}) {
  const { instance, teamSlug, projectSlug, authToken } = props;
  const activeWalletChain = useActiveWalletChain();
  const [_chainId, setChainId] = useState<number>();
  const chainId = _chainId || activeWalletChain?.id || 1;
  const pageSize = 10;
  const [page, setPage] = useState(1);

  const backendWallets = useEngineBackendWallets({
    authToken,
    instanceUrl: instance.url,
    limit: pageSize,
    page,
  });

  const { data: walletConfig } = useEngineWalletConfig({
    authToken,
    instanceUrl: instance.url,
  });

  const disableNextButton = (backendWallets.data?.length || 0) < pageSize;
  const disablePreviousButton = page === 1;
  const showPagination = !disableNextButton || !disablePreviousButton;

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="mb-1 font-semibold text-xl tracking-tight">
              Backend Wallets
            </h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Engine sends blockchain transactions from backend wallets you own
            and manage.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Set up other wallet types from the{" "}
            <UnderlineLink
              href={`/team/${teamSlug}/${projectSlug}/engine/${instance.id}/configuration`}
            >
              Configuration
            </UnderlineLink>{" "}
            tab, or{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/engine/v2/configure-wallets/server-wallet"
              rel="noopener noreferrer"
              target="_blank"
            >
              learn more about server wallets.
            </UnderlineLink>
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 border-border max-md:w-full max-md:border-t max-md:pt-6">
          {walletConfig && (
            <div className="flex flex-row justify-end gap-3 max-md:w-full">
              <ImportBackendWalletButton
                authToken={authToken}
                instance={instance}
                projectSlug={projectSlug}
                teamSlug={teamSlug}
                walletConfig={walletConfig}
              />
              <CreateBackendWalletButton
                authToken={authToken}
                instance={instance}
                projectSlug={projectSlug}
                teamSlug={teamSlug}
                walletConfig={walletConfig}
              />
            </div>
          )}

          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm">Show balance for</span>
              <div className="flex flex-row">
                <SingleNetworkSelector
                  align="end"
                  chainId={chainId}
                  className="min-w-40 max-w-52 lg:max-w-60"
                  client={props.client}
                  disableChainId
                  onChange={setChainId}
                  popoverContentClassName="!w-[80vw] md:!w-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BackendWalletsTable
        authToken={authToken}
        chainId={chainId}
        client={props.client}
        instanceUrl={instance.url}
        isFetched={backendWallets.isFetched}
        isPending={backendWallets.isPending}
        wallets={backendWallets.data ?? []}
      />

      {showPagination && (
        <div className="flex justify-end gap-3 border-t px-4 py-5">
          <Button
            className="gap-2"
            disabled={disablePreviousButton || backendWallets.isPending}
            onClick={() => setPage(page - 1)}
            variant="outline"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous
          </Button>

          <Button
            className="gap-2"
            disabled={disableNextButton || backendWallets.isPending}
            onClick={() => setPage(page + 1)}
            variant="outline"
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
