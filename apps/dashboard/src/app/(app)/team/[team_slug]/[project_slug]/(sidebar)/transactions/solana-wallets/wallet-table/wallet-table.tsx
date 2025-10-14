import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import type { SolanaWallet } from "./types";
import { SolanaWalletsTableUI } from "./wallet-table-ui.client";

export function SolanaWalletsTable({
  wallets,
  project,
  teamSlug,
  currentPage,
  totalPages,
  totalRecords,
  managementAccessToken,
  client,
}: {
  wallets: SolanaWallet[];
  project: Project;
  teamSlug: string;
  managementAccessToken: string | undefined;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  client: ThirdwebClient;
}) {
  return (
    <SolanaWalletsTableUI
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
