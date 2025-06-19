"use client";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/button";
import {
  type EngineInstance,
  useEngineBackendWallets,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWalletChain } from "thirdweb/react";
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
        instance={instance}
        teamSlug={teamSlug}
        projectSlug={projectSlug}
        authToken={authToken}
        client={client}
      />
      <div className="h-10" />
      <TransactionCharts instanceUrl={instance.url} authToken={authToken} />
      <div className="h-10" />
      <TransactionsTable
        instanceUrl={instance.url}
        authToken={authToken}
        client={client}
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
    instanceUrl: instance.url,
    authToken,
    limit: pageSize,
    page,
  });

  const { data: walletConfig } = useEngineWalletConfig({
    instanceUrl: instance.url,
    authToken,
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
              href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/${instance.id}/configuration`}
            >
              Configuration
            </UnderlineLink>{" "}
            tab, or{" "}
            <UnderlineLink
              href="https://portal.thirdweb.com/engine/v2/configure-wallets/server-wallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              learn more about server wallets.
            </UnderlineLink>
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 border-border max-md:w-full max-md:border-t max-md:pt-6">
          {walletConfig && (
            <div className="flex flex-row justify-end gap-3 max-md:w-full">
              <ImportBackendWalletButton
                instance={instance}
                walletConfig={walletConfig}
                teamSlug={teamSlug}
                projectSlug={projectSlug}
                authToken={authToken}
              />
              <CreateBackendWalletButton
                instance={instance}
                walletConfig={walletConfig}
                teamSlug={teamSlug}
                projectSlug={projectSlug}
                authToken={authToken}
              />
            </div>
          )}

          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm">Show balance for</span>
              <div className="flex flex-row">
                <SingleNetworkSelector
                  chainId={chainId}
                  onChange={setChainId}
                  className="min-w-40 max-w-52 lg:max-w-60"
                  popoverContentClassName="!w-[80vw] md:!w-[500px]"
                  align="end"
                  client={props.client}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BackendWalletsTable
        instanceUrl={instance.url}
        wallets={backendWallets.data ?? []}
        isPending={backendWallets.isPending}
        isFetched={backendWallets.isFetched}
        authToken={authToken}
        chainId={chainId}
        client={props.client}
      />

      {showPagination && (
        <div className="flex justify-end gap-3 border-t px-4 py-5">
          <Button
            variant="outline"
            disabled={disablePreviousButton || backendWallets.isPending}
            className="gap-2"
            onClick={() => setPage(page - 1)}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous
          </Button>

          <Button
            variant="outline"
            disabled={disableNextButton || backendWallets.isPending}
            className="gap-2"
            onClick={() => setPage(page + 1)}
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
