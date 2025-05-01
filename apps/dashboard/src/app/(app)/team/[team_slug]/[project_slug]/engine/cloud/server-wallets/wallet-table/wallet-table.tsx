import type { Project } from "@/api/projects";
import type { Wallet } from "./types";
import { ServerWalletsTableUI } from "./wallet-table-ui.client";

export function ServerWalletsTable({
  wallets,
  project,
  teamSlug,
  managementAccessToken,
}: {
  wallets: Wallet[];
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
}) {
  return (
    <ServerWalletsTableUI
      wallets={wallets}
      project={project}
      teamSlug={teamSlug}
      managementAccessToken={managementAccessToken}
    />
  );
}
