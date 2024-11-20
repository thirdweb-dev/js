"use client";

import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { useAuthorizedWallets } from "@3rdweb-sdk/react/hooks/useApi";
import { AuthorizedWalletsTable } from "components/settings/AuthorizedWallets/AuthorizedWalletsTable";

// TODO - remove ChakraProviderSetup after migrating AuthorizedWalletsTable
// TODO - fetch the authorized wallets server side

export default function Page() {
  const authorizedWalletsQuery = useAuthorizedWallets();

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col justify-between gap-4">
            <h1 className="font-semibold text-3xl tracking-tight">Devices</h1>
            <p className="text-muted-foreground">
              List of authorized devices that can perform actions on behalf of
              your account.
            </p>
            <ChakraProviderSetup>
              <AuthorizedWalletsTable
                authorizedWallets={authorizedWalletsQuery.data || []}
                isPending={authorizedWalletsQuery.isPending}
                isFetched={authorizedWalletsQuery.isFetched}
              />
            </ChakraProviderSetup>
          </div>
        </div>
      </div>
    </div>
  );
}
