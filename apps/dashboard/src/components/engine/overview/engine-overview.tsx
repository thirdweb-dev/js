"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
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
  instanceUrl: string;
}

export const EngineOverview: React.FC<EngineOverviewProps> = ({
  instanceUrl,
}) => {
  return (
    <div>
      <BackendWalletsSection instanceUrl={instanceUrl} />
      <div className="h-14" />
      <TransactionsSection instanceUrl={instanceUrl} />
    </div>
  );
};

function BackendWalletsSection(props: {
  instanceUrl: string;
}) {
  const { instanceUrl } = props;
  const backendWallets = useEngineBackendWallets(instanceUrl);
  const { data: walletConfig } = useEngineWalletConfig(instanceUrl);

  return (
    <section>
      <div className="flex flex-col items-start justify-between gap-5 lg:flex-row">
        <div>
          <div className="mb-0.5 flex items-center gap-3">
            <h2 className="font-semibold text-2xl tracking-tight">
              Backend Wallets
            </h2>
            {walletConfig?.type && (
              <ToolTipLabel
                label={
                  <>
                    This engine is configured to use{" "}
                    {walletConfig.type === "aws-kms"
                      ? "backend wallets secured by AWS KMS"
                      : walletConfig.type === "gcp-kms"
                        ? "backend wallets secured by GCP KMS"
                        : "local backend wallets"}
                    . You can change this in the Configuration tab.
                  </>
                }
              >
                <div>
                  <Badge variant="outline" className="text-base">
                    {walletConfig.type.replace("-", " ")}
                  </Badge>
                </div>
              </ToolTipLabel>
            )}
          </div>
          <p className="text-muted-foreground">
            Engine performs blockchain actions using backend wallets you own and
            manage.{" "}
            <Link
              href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
              className="text-link-foreground hover:text-foreground"
              target="_blank"
            >
              Learn more
            </Link>
          </p>
        </div>

        <div className="flex flex-row gap-2 max-sm:w-full [&>*]:grow">
          <ImportBackendWalletButton instanceUrl={instanceUrl} />
          <CreateBackendWalletButton instanceUrl={instanceUrl} />
        </div>
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
        instanceUrl={instanceUrl}
        wallets={backendWallets.data ?? []}
        isPending={backendWallets.isPending}
        isFetched={backendWallets.isFetched}
      />
    </section>
  );
}

function TransactionsSection(props: {
  instanceUrl: string;
}) {
  const { instanceUrl } = props;
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const transactionsQuery = useEngineTransactions(instanceUrl, autoUpdate);

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
      />
    </section>
  );
}
