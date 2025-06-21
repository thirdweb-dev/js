"use client";

import { useAuthorizedWallets } from "@3rdweb-sdk/react/hooks/useApi";
import { AuthorizedWalletsTable } from "components/settings/AuthorizedWallets/AuthorizedWalletsTable";

// TODO - fetch the authorized wallets server side

export function AccountDevicesPage() {
  const authorizedWalletsQuery = useAuthorizedWallets();

  return (
    <AuthorizedWalletsTable
      authorizedWallets={authorizedWalletsQuery.data || []}
      isFetched={authorizedWalletsQuery.isFetched}
      isPending={authorizedWalletsQuery.isPending}
    />
  );
}
