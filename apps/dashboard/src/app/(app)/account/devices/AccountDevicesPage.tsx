"use client";

import { useAuthorizedWallets } from "@/hooks/useApi";
import { AuthorizedWalletsTable } from "./AuthorizedWalletsTable";

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
