import type { Project } from "@/api/projects";
import type { Wallet } from "./types";
import { ServerWalletsTableUI } from "./wallet-table-ui.client";

export function ServerWalletsTable({
  wallets,
  project,
  managementAccessToken,
}: {
  wallets: Wallet[];
  project: Project;
  managementAccessToken: string | undefined;
}) {
  return (
    <ServerWalletsTableUI
      wallets={wallets}
      project={project}
      managementAccessToken={managementAccessToken}
    />
  );
}
