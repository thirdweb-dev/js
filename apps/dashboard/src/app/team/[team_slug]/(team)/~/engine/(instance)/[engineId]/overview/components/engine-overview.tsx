"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type EngineInstance,
  useEngineBackendWallets,
  useEngineTransactions,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import Link from "next/link";
import { useState } from "react";
import { BackendWalletsTable } from "./backend-wallets-table";
import { CreateBackendWalletButton } from "./create-backend-wallet-button";
import { ImportBackendWalletButton } from "./import-backend-wallet-button";
import { TransactionsTable } from "./transactions-table";

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
      <div className="h-14" />
      <TransactionsSection instanceUrl={instance.url} authToken={authToken} />
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
    <section>
      <div className="flex flex-col items-start justify-between gap-5 lg:flex-row">
        <div>
          <div className="mb-0.5 flex items-center gap-3">
            <h2 className="font-semibold text-2xl tracking-tight">
              Backend Wallets
            </h2>
          </div>
          <p className="text-muted-foreground">
            Engine sends blockchain transactions from backend wallets you own
            and manage.
          </p>
          <p className="text-muted-foreground">
            Set up other wallet types from the{" "}
            <Link
              href={`/team/${teamSlug}/~/engine/${instance.id}/configuration`}
              className="text-link-foreground hover:text-foreground"
            >
              Configuration
            </Link>{" "}
            tab, or{" "}
            <Link
              href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
              target="_blank"
              className="text-link-foreground hover:text-foreground"
            >
              learn more about backend wallets.
            </Link>
          </p>
        </div>

        {walletConfig && (
          <div className="flex flex-row gap-2 max-sm:w-full [&>*]:grow">
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
      </div>

      <div className="h-4" />

      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show balance for</span>
          {/* TODO - Replace with simple network selector - there's no need for user to switch chain  */}
          <div className="flex flex-row">
            <NetworkSelectorButton />
          </div>
        </div>
      </div>

      <div className="h-4" />

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

function TransactionsSection(props: {
  instanceUrl: string;
  authToken: string;
}) {
  const { instanceUrl, authToken } = props;
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const transactionsQuery = useEngineTransactions({
    instanceUrl,
    autoUpdate,
    authToken,
  });

  return (
    <section>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div>
          <h2 className="mb-0.5 font-semibold text-2xl tracking-tight">
            Transactions
          </h2>
          <p className="text-muted-foreground">
            View transactions sent from your backend wallets in the past 24
            hours.
          </p>
        </div>

        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-update">Auto-Update</Label>
            <Switch
              checked={autoUpdate}
              onCheckedChange={(v) => setAutoUpdate(!!v)}
              id="auto-update"
            />
          </div>
        </div>
      </div>

      <div className="h-4" />

      <TransactionsTable
        transactions={transactionsQuery.data?.transactions ?? []}
        isPending={transactionsQuery.isPending}
        isFetched={transactionsQuery.isFetched}
        instanceUrl={instanceUrl}
        authToken={authToken}
      />
    </section>
  );
}
