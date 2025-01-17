"use client";
import {
  type EngineInstance,
  useEngineBackendWallets,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import Link from "next/link";
import { BackendWalletsTable } from "./backend-wallets-table";
import { CreateBackendWalletButton } from "./create-backend-wallet-button";
import { ImportBackendWalletButton } from "./import-backend-wallet-button";
import { TransactionCharts, TransactionsTable } from "./transactions-table";

interface EngineOverviewProps {
  instance: EngineInstance;
  teamSlug: string;
  authToken: string;
}

export const EngineOverview: React.FC<EngineOverviewProps> = ({
  instance,
  teamSlug,
  authToken,
}) => {
  return (
    <div>
      <BackendWalletsSection
        instance={instance}
        teamSlug={teamSlug}
        authToken={authToken}
      />
      <div className="h-10" />
      <TransactionCharts instanceUrl={instance.url} authToken={authToken} />
      <div className="h-10" />
      <TransactionsTable instanceUrl={instance.url} authToken={authToken} />
    </div>
  );
};

function BackendWalletsSection(props: {
  instance: EngineInstance;
  teamSlug: string;
  authToken: string;
}) {
  const { instance, teamSlug, authToken } = props;
  const backendWallets = useEngineBackendWallets({
    instanceUrl: instance.url,
    authToken,
  });
  const { data: walletConfig } = useEngineWalletConfig({
    instanceUrl: instance.url,
    authToken,
  });

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
            <Link
              href={`/team/${teamSlug}/~/engine/${instance.id}/configuration`}
              className="underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 hover:text-foreground hover:decoration-foreground hover:decoration-solid"
            >
              Configuration
            </Link>{" "}
            tab, or{" "}
            <Link
              href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
              target="_blank"
              className="underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 hover:text-foreground hover:decoration-foreground hover:decoration-solid"
            >
              learn more about backend wallets.
            </Link>
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 border-border max-md:w-full max-md:border-t max-md:pt-6">
          {walletConfig && (
            <div className="flex flex-row justify-end gap-3 max-md:w-full">
              <ImportBackendWalletButton
                instance={instance}
                walletConfig={walletConfig}
                teamSlug={teamSlug}
                authToken={authToken}
              />
              <CreateBackendWalletButton
                instance={instance}
                walletConfig={walletConfig}
                teamSlug={teamSlug}
                authToken={authToken}
              />
            </div>
          )}

          <div className="flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-sm">Show balance for</span>
              {/* TODO - Replace with simple network selector - there's no need for user to switch chain  */}
              <div className="flex flex-row">
                <NetworkSelectorButton />
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
      />
    </section>
  );
}
