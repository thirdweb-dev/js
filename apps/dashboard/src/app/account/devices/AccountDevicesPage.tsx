"use client";

import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { useAuthorizedWallets } from "@3rdweb-sdk/react/hooks/useApi";
import { AuthorizedWalletsTable } from "components/settings/AuthorizedWallets/AuthorizedWalletsTable";

// TODO - remove ChakraProviderSetup after migrating AuthorizedWalletsTable
// TODO - fetch the authorized wallets server side

export function AccountDevicesPage() {
  const authorizedWalletsQuery = useAuthorizedWallets();

  return (
    <ChakraProviderSetup>
      <AuthorizedWalletsTable
        authorizedWallets={authorizedWalletsQuery.data || []}
        isPending={authorizedWalletsQuery.isPending}
        isFetched={authorizedWalletsQuery.isFetched}
      />
    </ChakraProviderSetup>
  );
}
