import type { Wallet } from "./types";
import { ServerWalletsTableUI } from "./wallet-table-ui.client";

export function ServerWalletsTable({
  wallets,
  projectId,
  teamId,
  managementAccessToken,
}: {
  wallets: Wallet[];
  projectId: string;
  teamId: string;
  managementAccessToken: string | undefined;
}) {
  return (
    <ServerWalletsTableUI
      wallets={wallets}
      projectId={projectId}
      teamId={teamId}
      managementAccessToken={managementAccessToken}
    />
  );
}
