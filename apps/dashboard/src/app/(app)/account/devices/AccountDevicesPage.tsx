"use client";

import { AuthorizedWalletsTable } from "@app/account/devices/AuthorizedWalletsTable";
import { useAuthorizedWallets } from "@/hooks/useApi";

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
