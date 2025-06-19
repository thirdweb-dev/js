"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useEngineWalletCredentials,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { CreateWalletCredentialButton } from "./create-wallet-credential-button";
import { WalletCredentialsTable } from "./wallet-credentials-table";

interface WalletCredentialsProps {
  instanceUrl: string;
  authToken: string;
}

export const WalletCredentialsSection: React.FC<WalletCredentialsProps> = ({
  instanceUrl,
  authToken,
}) => {
  const {
    data: credentials = [],
    isPending,
    isFetched,
  } = useEngineWalletCredentials({
    instanceUrl,
    authToken,
  });

  const {
    isSupported: supportsWalletCredentials,
    query: { isPending: isFeatureLoading },
  } = useHasEngineFeature(instanceUrl, "WALLET_CREDENTIALS");

  if (isFeatureLoading) {
    return (
      <div className="flex min-h-[500px] grow items-center justify-center rounded-lg border border-border">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!supportsWalletCredentials) {
    return (
      <Alert variant="warning">
        <CircleAlertIcon className="size-4" />
        <AlertTitle>Update Required</AlertTitle>
        <AlertDescription>
          Wallet credentials support requires a newer version of Engine. Please
          update your Engine instance to use this feature.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-5 border-border border-b p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="mb-1 font-semibold text-xl tracking-tight">
            Wallet Credentials
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Manage your wallet credentials for different providers.{" "}
            <Link
              href="https://portal.thirdweb.com/engine/features/wallet-credentials"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about wallet credentials.
            </Link>
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 border-border max-md:w-full max-md:border-t max-md:pt-6">
          <CreateWalletCredentialButton
            instanceUrl={instanceUrl}
            authToken={authToken}
          />
        </div>
      </div>

      <WalletCredentialsTable
        credentials={credentials}
        isPending={isPending}
        isFetched={isFetched}
        instanceUrl={instanceUrl}
        authToken={authToken}
      />
    </section>
  );
};
