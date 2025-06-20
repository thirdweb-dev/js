import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/projects";
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
      client={client}
      currentPage={currentPage}
      managementAccessToken={managementAccessToken}
      project={project}
      teamSlug={teamSlug}
      totalPages={totalPages}
      totalRecords={totalRecords}
      wallets={wallets}
    />
  );
}
