import { TryItOut } from "../components/try-it-out";
import type { Wallet } from "./types";
import { ServerWalletsTableUI } from "./wallet-table-ui";

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
    <div className="flex flex-col gap-8">
      <ServerWalletsTableUI
        wallets={wallets}
        projectId={projectId}
        teamId={teamId}
        managementAccessToken={managementAccessToken}
      />
      <TryItOut />
    </div>
  );
}
