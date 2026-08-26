import "server-only";

import { listVaultServerWallets } from "@/actions/vault";
import type { Wallet } from "../server-wallets/wallet-table/types";

export type ServerWalletList = {
  data: { items: Wallet[]; totalRecords: number };
  error: Error | null;
  success: boolean;
};

export async function listEvmServerWallets(params: {
  teamId: string;
  projectId: string;
  page?: number;
  limit?: number;
}): Promise<ServerWalletList> {
  const { teamId, projectId, page = 1, limit = 100 } = params;

  try {
    const result = await listVaultServerWallets({
      chainType: "evm",
      page,
      pageSize: limit,
      project: { projectId, teamId },
    });

    return {
      data: {
        items: result.wallets.map<Wallet>((wallet) => ({
          address: wallet.address,
          createdAt: wallet.createdAt,
          id: wallet.address,
          metadata: {
            label: wallet.label ?? undefined,
            projectId,
            type: "server-wallet",
          },
          updatedAt: wallet.updatedAt,
        })),
        totalRecords: result.totalRecords,
      },
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: { items: [], totalRecords: 0 },
      error: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
}
