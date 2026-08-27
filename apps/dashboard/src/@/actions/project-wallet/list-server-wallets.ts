"use server";

import { listVaultServerWallets } from "@/actions/vault";
import type { ProjectWalletSummary } from "@/lib/server/project-wallet";

export async function listProjectServerWallets(params: {
  teamId: string;
  projectId: string;
  pageSize?: number;
}): Promise<ProjectWalletSummary[]> {
  const { teamId, projectId, pageSize = 100 } = params;

  try {
    const { wallets } = await listVaultServerWallets({
      chainType: "evm",
      pageSize,
      project: { projectId, teamId },
    });

    return wallets.map<ProjectWalletSummary>((wallet) => ({
      address: wallet.address,
      id: wallet.address,
      label: wallet.label ?? undefined,
    }));
  } catch (error) {
    console.error("Failed to list project server wallets", error);
    return [];
  }
}
