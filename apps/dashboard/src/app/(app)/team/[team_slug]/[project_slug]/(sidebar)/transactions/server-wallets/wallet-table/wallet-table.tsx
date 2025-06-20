import type { Project } from "@/api/projects";
import type { ThirdwebClient } from "thirdweb";
import type { Wallet } from "./types";
import { ServerWalletsTableUI } from "./wallet-table-ui.client";

export function ServerWalletsTable({
  wallets,
  project,
  teamSlug,
  currentPage,
  totalPages,
  totalRecords,
  managementAccessToken,
  client,
}: {
  wallets: Wallet[];
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  client: ThirdwebClient;
}) {
  return (
    <ServerWalletsTableUI
      wallets={wallets}
      totalRecords={totalRecords}
      currentPage={currentPage}
      totalPages={totalPages}
      project={project}
      teamSlug={teamSlug}
      managementAccessToken={managementAccessToken}
      client={client}
    />
  );
}
